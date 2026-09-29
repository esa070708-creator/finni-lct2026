package ru.finni.pet;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.*;
import android.view.View;
import java.io.InputStream;

public final class MainActivity extends Activity {
 private WebView web;
 private static final String ORIGIN="https://finni.local/";
 @Override public void onCreate(Bundle savedInstanceState){
  super.onCreate(savedInstanceState);
  getWindow().setStatusBarColor(0xfff6f8f5);
  getWindow().setNavigationBarColor(0xfff6f8f5);
  getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
  web=new WebView(this);setContentView(web);
  web.setOnApplyWindowInsetsListener((v,insets)->{v.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets.consumeSystemWindowInsets();});
  WebSettings settings=web.getSettings();
  settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);
  settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);
  settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
  settings.setJavaScriptCanOpenWindowsAutomatically(false);
  settings.setSupportMultipleWindows(false);
  web.setWebViewClient(new WebViewClient(){
   @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){return !request.getUrl().toString().startsWith(ORIGIN);}
   @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
    String url=request.getUrl().toString();
    if(!url.startsWith(ORIGIN))return new WebResourceResponse("text/plain","UTF-8",null);
    String file=request.getUrl().getPath();if(file==null||file.equals("/"))file="/index.html";
    if(file.contains(".."))return new WebResourceResponse("text/plain","UTF-8",null);
    String mime=file.endsWith(".js")?"application/javascript":file.endsWith(".css")?"text/css":file.endsWith(".png")?"image/png":file.endsWith(".svg")?"image/svg+xml":"text/html";
    try{InputStream stream=getAssets().open(file.substring(1));return new WebResourceResponse(mime,"UTF-8",stream);}catch(Exception e){return new WebResourceResponse("text/plain","UTF-8",null);}
   }
  });
  web.loadUrl(ORIGIN);
 }
 @Override public void onBackPressed(){web.evaluateJavascript("if(document.querySelector('#dialog').open){closeModal()}else if(typeof route!=='undefined'&&route!=='home'){go('home')}else{false}",null);}
 @Override protected void onPause(){super.onPause();web.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
 @Override protected void onDestroy(){if(web!=null)web.destroy();super.onDestroy();}
}
