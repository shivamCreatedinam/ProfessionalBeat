package com.createdinam.professionbeat;

import androidx.annotation.NonNull;
import com.proyecto26.inappbrowser.RNInAppBrowserModule;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import io.wazo.callkeep.RNCallKeepModule; // Add these import lines
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.otplessreactnative.OtplessReactNativeManager;
import android.content.Intent;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ProfessionBeat";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util
   * class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and
   * Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e.
        // React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
    );
  }

  @Override
  protected void onStart() {
    super.onStart();
    RNInAppBrowserModule.onStart(this);
  }

  // Permission results
  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    switch (requestCode) {
      case RNCallKeepModule.REQUEST_READ_PHONE_STATE:
        RNCallKeepModule.onRequestPermissionsResult(requestCode, permissions, grantResults);
        break;
    }
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    OtplessReactNativeManager.INSTANCE.onNewIntent(intent);
  }

  @Override
  public void onBackPressed() {
    if (OtplessReactNativeManager.INSTANCE.onBackPressed())
      return;
    super.onBackPressed();
  }

}
