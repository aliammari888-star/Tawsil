package com.tawsil.app;

import android.app.Application;

public class TawsilApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        // Firebase.initializeApp(this) يصير أوتوماتيكيا بفضل google-services.json
    }
}
