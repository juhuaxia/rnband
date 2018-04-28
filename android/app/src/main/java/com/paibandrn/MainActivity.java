package com.paibandrn;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PaiBandRN";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected Bundle getLaunchOptions() {
                Bundle initialProps = new Bundle();
                //initialProps.putString("appid", "1108");
                //initialProps.putString("token", "a2a71fb691d644fa8837111a847a2445");
                //initialProps.putString("uid", "60004460");
                //initialProps.putString("cid", "60004464");
                //initialProps.putString("page", "grow");

                //initialProps.putString("appid", "1124");
                //initialProps.putString("token", "yPyeyGJuJQGDyAGGPsDuylleDAyNGGPPQQlsPPyJlPPPQQGNPPotNAPPQQyJPPAlAuPPQQeJPPPleJPPPPwePPPPtKeAulAePPPPNQAPwJGAPGPPKyPJtPPGJGPPoJAe");
                //initialProps.putString("uid", "60008566");
                //initialProps.putString("cid", "60013853");
                //initialProps.putString("lang", "en");
                //initialProps.putString("page", "grow");

                //initialProps.putString("appid", "1124");
                //initialProps.putString("token", "yPyeyGJuJQGDyAGGPsDuytPJNQKQwGPPQQGuPPtetGPPQQKtPPDeQyPPQQeoPPewQQPPQQNNPPPPQuPPPPNlPPPPlPeAulGsPPPPJtAGwJGsPGPPwlQetPKAJGPPoJwy");
                //initialProps.putString("uid", "6038917");
                //initialProps.putString("cid", "6014636");
                //initialProps.putString("lang", "en");
                //initialProps.putString("page", "grow");

                initialProps.putString("appid", "1124");
                initialProps.putString("token", "yPyeyGJuJQGDyAGGPsDuAesweQAwPGPPQQKGPPsDuQPPQQetPPJuPuPPQQDwPPesKKPPQQuoPPPPKuPPPPeyPPPPNoeAultoPPPPGGNlwJGePGPPAtAltPDDJGPPNeuy");
                initialProps.putString("uid", "6185442");
                initialProps.putString("cid", "6028626");
                initialProps.putString("lang", "en");
                initialProps.putString("page", "grow");
                return initialProps;
            }
        };
    }
}
