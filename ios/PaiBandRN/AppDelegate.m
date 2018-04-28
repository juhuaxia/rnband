/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  //NSDictionary *props = @{@"appid" : @"1108",
                          //@"token" : @"a2a71fb691d644fa8837111a847a2445",
                          //@"uid"   : @"60004460",
                          //@"cid"   : @"60004464",
                          //@"page"  : @"grow" };

  //NSDictionary *props = @{@"appid" : @"1124",
                          //@"token" : @"08f2c58413774de2b3b74e922f05bfc6",
                          //@"uid"   : @"60011056",
                          //@"cid"   : @"60011092",
                          //@"page"  : @"sportChart" };
                      
  // NSDictionary *props = @{@"appid" : @"1122",
  //                         @"token" : @"yPyeyGJuJQGDyAGGPsDuyDsoeyPywGPPQQAAPPueGKPPQQKDPPNKPGPPQQPAPPAlwoPPQQlyPPPleoPPPPusPPPPeleAulJJPPPPDotQwJGJPGPPDNNAtPPsJDPPNoQy",
  //                         @"uid"   : @"60013845",
  //                         @"cid"   : @"60013848",
  //                         @"lang"   : @"en",
  //                         @"page"  : @"sportChart" };
                         
                    
  // //mgh线上环境
  // NSDictionary *props = @{@"appid" : @"1122",
  //                         @"token" : @"yPyeyGJuJQGDyAGGPsDuyNQlQPDetGPPQQuKPPywyGPPQQwoPPesGDPPQQKGPPesNPPPQQlDPPPPDlPPPPJoPPPPePeAulPNPPPPwuAtwJGwPGPPPJQNtPwyJDPPADuy",
  //                         @"uid"   : @"6184572",
  //                         @"cid"   : @"6184672",
  //                         @"lang"   : @"en",
  //                         @"page"  : @"sportChart" };
                          
   //mgh测试环境
  NSDictionary *props = @{@"appid" : @"1124",
                          @"token" : @"yPyeyGJuJQGDyAGGPsDutNJtQKQAGGPPQQywPPyPsJPPQQtNPPotlKPPQQAoPPAlwAPPQQNPPPPlywPPPPDGPPPPuoeAulsPPPPPDyotwJGQPGPPJKwQtPulJGPPtNuK",
                          @"uid"   : @"60008560",
                          @"cid"   : @"60018352",
                          @"lang"   : @"en",
                          @"page"  : @"sportChart" };

  //http://api-paiband-test.ptdev.cn/paiband/motion/daily?appid=1124&uid=60004006&token=yPyeyGJuJQGDyAGGPsDuJJuuAJyutGPPQQsGPPoJQePPQQNKPPAJowPPQQQlPPAlKsPPQQPwPPPlowPPPPGsPPPPyQeAulDoPPPPustDwJGsPGPPowADtPlsJGPPNtGA&cid=60011156

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"PaiBandRN"
                                               initialProperties:props
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
