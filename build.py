"""Build offline Finni APK using official Android Build Tools and a caller-owned key."""
from pathlib import Path
import os, subprocess, shutil, zipfile

root=Path(__file__).resolve().parent
required=['FINNI_JDK','FINNI_BUILD_TOOLS','FINNI_ANDROID_JAR','FINNI_KEYSTORE','FINNI_KEY_PASSWORD']
missing=[k for k in required if not os.environ.get(k)]
if missing:raise SystemExit('Set environment variables: '+', '.join(missing))
jdk=Path(os.environ['FINNI_JDK']);tools=Path(os.environ['FINNI_BUILD_TOOLS']);android=Path(os.environ['FINNI_ANDROID_JAR']);key=Path(os.environ['FINNI_KEYSTORE'])
build=root/'build';build.mkdir(exist_ok=True)
main=root/'android/app/src/main';env=os.environ.copy();env['JAVA_HOME']=str(jdk)
exe='.exe' if os.name=='nt' else ''
def run(*args):subprocess.run([str(a) for a in args],check=True,env=env)
for folder in ['classes','dex','platform-classes']:(build/folder).mkdir(exist_ok=True)
with zipfile.ZipFile(android) as archive:archive.extractall(build/'platform-classes')
shutil.copytree(root/'app',main/'assets',dirs_exist_ok=True)
(main/'res/drawable').mkdir(exist_ok=True)
shutil.copy2(root/'app/assets/logo.png',main/'res/drawable/icon.png')
run(tools/('aapt2'+exe),'compile','--dir',main/'res','-o',build/'resources.zip')
run(tools/('aapt2'+exe),'link','-o',build/'unsigned.apk','-I',android,'--manifest',main/'AndroidManifest.xml','-A',main/'assets',build/'resources.zip')
run(jdk/'bin'/('javac'+exe),'-encoding','UTF-8','-source','8','-target','8','-classpath',android,'-d',build/'classes',main/'java/ru/finni/pet/MainActivity.java')
run(jdk/'bin'/('java'+exe),'-cp',tools/'lib/d8.jar','com.android.tools.r8.D8','--release','--min-api','26','--lib',android,'--output',build/'dex',*list((build/'classes').rglob('*.class')))
with zipfile.ZipFile(build/'unsigned.apk','a',zipfile.ZIP_DEFLATED) as archive:
 for dex in (build/'dex').glob('*.dex'):archive.write(dex,dex.name)
run(tools/('zipalign'+exe),'-f','4',build/'unsigned.apk',build/'aligned.apk')
run(jdk/'bin'/('java'+exe),'-jar',tools/'lib/apksigner.jar','sign','--ks',key,'--ks-key-alias','finni','--ks-pass','env:FINNI_KEY_PASSWORD','--out',build/'Finni.apk',build/'aligned.apk')
run(jdk/'bin'/('java'+exe),'-jar',tools/'lib/apksigner.jar','verify','--verbose',build/'Finni.apk')
print('Built:',build/'Finni.apk')

