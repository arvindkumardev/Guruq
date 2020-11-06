//
//  AllInOneSDKSwiftWrapper.swift
//  GuruQ
//
//  Created by Arun on 06/11/20.
//

import Foundation
import AppInvokeSDK
import UIKit
class EventEmitter {
    /// Shared Instance.
    public static var sharedInstance = EventEmitter()
    // ReactNativeEventEmitter is instantiated by React Native with the bridge.
    private static var eventEmitter: AllInOneSDKSwiftWrapper!
    private init() {}
    // When React Native instantiates the emitter it is registered here.
    func registerEventEmitter(eventEmitter: AllInOneSDKSwiftWrapper) {
        EventEmitter.eventEmitter = eventEmitter
    }
    func dispatch(name: String, body: Any?) {
      EventEmitter.eventEmitter.sendEvent(withName: name, body: body)
    }
    /// All Events which must be support by React Native.
    lazy var allEvents: [String] = {
        var allEventNames: [String] = ["responseIfNotInstalled", "responseIfPaytmInstalled"]
        // Append all events here
        return allEventNames
    }()
 
}
 
@objc(AllInOneSDKSwiftWrapper)
class AllInOneSDKSwiftWrapper:RCTEventEmitter, AIDelegate {
    var viewController = UIApplication.shared.windows.first?.rootViewController
    let appinvoke = AIHandler()
    override static func moduleName() -> String! {
        return "AllInOneSDKSwiftWrapper"
    }
    override init() {
        super.init()
        EventEmitter.sharedInstance.registerEventEmitter(eventEmitter: self)
        NotificationCenter.default.addObserver(self, selector: #selector(getAppInvokeResponse(notification:)), name: NSNotification.Name(rawValue: "appInvokeNotification"), object: nil)
    }
    @objc func getAppInvokeResponse(notification: NSNotification) {
        if let userInfo = notification.userInfo {
        let url = userInfo["appInvokeNotificationKey"] as? String
        let response = self.separateDeeplinkParamsIn(url: url, byRemovingParams: nil)
        let alert = UIAlertController(title: "Response", message: response.description, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .cancel, handler: nil))
        self.viewController?.present(alert, animated: true, completion: nil)
        sendEvent(withName: "responseIfPaytmInstalled", body: response)
        }
    }
    /// Base overide for RCTEventEmitter.
    ///
    /// - Returns: all supported events
    @objc open override func supportedEvents() -> [String] {
        return EventEmitter.sharedInstance.allEvents
    }
    func openPaymentWebVC(_ controller: UIViewController?) {
        if let vc = controller {
            DispatchQueue.main.async {[weak self] in
            self?.viewController?.present(vc, animated: true, completion: nil)
            }
        }
    }
    func didFinish(with status: AIPaymentStatus, response: [String : Any]) {
        sendEvent(withName: "responseIfNotInstalled", body: response)
        let alert = UIAlertController(title: "(status)", message: String(describing: response), preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        DispatchQueue.main.async {
        self.viewController?.present(alert, animated: true, completion: nil)
        }
    }
    //  override func supportedEvents() -> [String]! {
    //    return ["responseIfNotInstalled"]
    //  }
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    @objc(openPaytm:orderId:transactionToken:amount:callbackUrl:isStaging:)
    func openPaytm(_ mid: String, orderId: String, transactionToken: String, amount: String, callbackUrl: String?, isStaging: Bool) {
        DispatchQueue.main.async {
        var env:AIEnvironment = .production
        if isStaging {
            env = .staging
        } else {
            env = .production
        }
        self.appinvoke.openPaytm(merchantId: mid, orderId: orderId, txnToken: transactionToken, amount: amount, callbackUrl: callbackUrl, delegate: self, environment: env)
        }
    }
    @objc func separateDeeplinkParamsIn(url: String?, byRemovingParams rparams: [String]?)  -> [String: String] {
        guard let url = url else {
            return [String : String]()
        }
        /// This url gets mutated until the end. The approach is working fine in current scenario. May need a revisit.
        var urlString = stringByRemovingDeeplinkSymbolsIn(url: url)
        var paramList = [String : String]()
        let pList = urlString.components(separatedBy: CharacterSet.init(charactersIn: "&?"))
        for keyvaluePair in pList {
            let info = keyvaluePair.components(separatedBy: CharacterSet.init(charactersIn: "="))
            if let fst = info.first , let lst = info.last, info.count == 2 {
                paramList[fst] = lst.removingPercentEncoding
                if let rparams = rparams, rparams.contains(info.first!) {
                    urlString = urlString.replacingOccurrences(of: keyvaluePair + "&", with: "")
                    //Please dont interchage the order
                    urlString = urlString.replacingOccurrences(of: keyvaluePair, with: "")
                }
            }
        }
        if let trimmedURL = pList.first {
            paramList["trimmedurl"] = trimmedURL
        }
        return paramList
    }
    func  stringByRemovingDeeplinkSymbolsIn(url: String) -> String {
        var urlString = url.replacingOccurrences(of: "$", with: "&")
        // This may need a revisit. This is doing more than just removing the deeplink symbol.
        if let range = urlString.range(of: "&"), urlString.contains("?") == false{
            urlString = urlString.replacingCharacters(in: range, with: "?")
        }
        return urlString
    }
 
}
