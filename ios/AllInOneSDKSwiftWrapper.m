//
//  AllInOneSDKSwiftWrapper.m
//  GuruQ
//
//  Created by Arun on 06/11/20.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"
#if __has_include("RCTEventEmitter.h")
#import "RCTEventEmitter.h"
#else
#import <React/RCTEventEmitter.h>
#endif

@interface RCT_EXTERN_MODULE(AllInOneSDKSwiftWrapper, RCTEventEmitter)
 
RCT_EXTERN_METHOD(openPaytm:(NSString *)mid
orderId:(NSString *)oid
transactionToken:(NSString *)txnTkn
amount:(NSString *)amt
callbackUrl:(NSString *)url
isStaging: (BOOL)isStaging)
@end
