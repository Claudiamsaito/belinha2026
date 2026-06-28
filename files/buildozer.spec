[app]

# (str) Title of your application
title = Missão Saúde Ilhabela

# (str) Package name
package.name = missao_saude_ilhabela

# (str) Package domain (needed for android/ios packaging)
package.domain = org.santacasa.ilhabela

# (source.dir) Source directory (where the main.py is)
source.dir = .

# (list) Source include patterns (let empty to include all the files)
source.include_exts = py,png,jpg,kv,atlas

# (list) List of inclusions using pattern matching
#source.include_patterns = assets/*,images/*.png

# (list) Source exclude patterns
#source.exclude_exts = spec

# (list) List of directory to exclude (let empty to not exclude anything)
#source.exclude_dirs = tests, bin, venv

# (list) List of exclusions using pattern matching
#source.exclude_patterns = license,images/*/*.py

# (str) Application versioning (method 1)
version = 1.0

# (str) Application versioning (method 2)
# version.filename = %(source.dir)s/buildozer.txt

# (list) Application requirements
# comma separated e.g. requirements = sqlite3,kivy
requirements = python3,kivy,pillow,sqlite3

# (str) Supported orientation (landscape, sensorLandscape, portrait or sensorPortrait)
orientation = portrait

# (list) List of service to declare
#services = NAME:ENTRYPOINT_TO_SERVICE [,NAME2:ENTRYPOINT_TO_SERVICE2] [...]


#
# Android specific
#

# (bool) Indicate if the application should be fullscreen or not
fullscreen = 0

# (string) Presplash background color (for new android toolchain)
# Supported formats are: #RRGGBB #AARRGGBB or one of 'red', 'blue', 'green', 'black', 'white', 'gray', 'cyan', 'magenta', 'yellow', 'lightgray', 'darkgray', 'lightgrey', 'darkgrey', 'aqua', 'fuchsia', 'lime', 'maroon', 'navy', 'olive', 'purple', 'silver', 'teal'.
#presplash_bgcolor = #FFFFFF

# (list) Permissions
android.permissions = INTERNET,CAMERA,WRITE_EXTERNAL_STORAGE,READ_EXTERNAL_STORAGE

# (int) Target Android API, should be as high as possible.
android.api = 33

# (int) Minimum API your APK will support.
android.minapi = 21

# (int) Android SDK version to use
#android.sdk = 20

# (str) Android NDK version to use
#android.ndk = 21b

# (int) Android NDK API to use. This is the minimum API your native
# libraries will support.
#android.ndk_api = 21

# (bool) Use --private data storage (True) or --dir public storage (False)
#android.private_storage = True

# (str) Android app theme, default is ok for Kivy-based app
# android.theme = "@android:style/Theme.NoTitleBar"

# (bool) Copy library instead of making a libpymodules.so
#android.copy_libs = 1

# (str) The Android arch to build for, choices: armeabi-v7a, arm64-v8a, x86, x86_64
android.archs = arm64-v8a,armeabi-v7a

# (int) overrides automatic versionCode (used in build.gradle) and should only be edited if you know what you're doing
# android.version_code = 1

# (list) Pattern to whitelist for the whole project
#android.whitelist = lib-dynload/termios.so

# (str) Path to a Java .jar used to build android
#android.add_src =

# (str) launchMode to set - oneTask is default. oneTask cannot be used with singleTask
# android.launch_mode = standard

# (bool) Copy library instead of making a libpymodules.so
#android.copy_libs = 1

# (str) The Android arch to build for, choices: armeabi-v7a, arm64-v8a, x86, x86_64
#android.archs = arm64-v8a

# (bool) enables Android auto backup & restore. Disabled by default with Kivy.
# android.allow_backup = True

# (str) XML file for custom backup scheme, see the documentation
# android.backup_schemes = @xml/backup_scheme

# (str) Presplash of the application (image or XML layout) instead of default kivy logo.
# android.presplash_filename = %(source.dir)s/data/presplash.png

# (str) Icon of the application
# android.icon.filename = %(source.dir)s/data/icon.png

# (str) Presplash background color (for new android toolchain)
# Supported formats are: #RRGGBB #AARRGGBB or one of 'red', 'blue', 'green', 'black', 'white', 'gray', 'cyan', 'magenta', 'yellow', 'lightgray', 'darkgray', 'lightgrey', 'darkgrey', 'aqua', 'fuchsia', 'lime', 'maroon', 'navy', 'olive', 'purple', 'silver', 'teal'.
#android.presplash_bgcolor = #FFFFFF

# (list) Permissions
#android.permissions = INTERNET

# (int) Target Android API, should be as high as possible.
#android.api = 31

# (int) Minimum API your APK will support.
#android.minapi = 21

# (int) Android SDK version to use
#android.sdk = 30

# (str) Android NDK version to use
#android.ndk = 23b

# (int) Android NDK API to use. This is the minimum API your native
# libraries will support.
#android.ndk_api = 21

# (bool) Use --private data storage (True) or --dir public storage (False)
#android.private_storage = True

# (str) Android app theme, default is ok for Kivy-based app
# android.theme = "@android:style/Theme.NoTitleBar"

# (bool) Copy library instead of making a libpymodules.so
#android.copy_libs = 1

# (str) The Android arch to build for, choices: armeabi-v7a, arm64-v8a, x86, x86_64
#android.archs = arm64-v8a

# (int) overrides automatic versionCode (used in build.gradle) and should only be edited if you know what you're doing
# android.version_code = 1

# (list) Pattern to whitelist for the whole project
#android.whitelist = lib-dynload/termios.so

# (str) Path to a Java .jar used to build android
#android.add_src =

# (str) launchMode to set - oneTask is default. oneTask cannot be used with singleTask
# android.launch_mode = standard

# (bool) Copy library instead of making a libpymodules.so
#android.copy_libs = 1

# (str) The Android arch to build for, choices: armeabi-v7a, arm64-v8a, x86, x86_64
#android.archs = arm64-v8a

# (bool) enables Android auto backup & restore. Disabled by default with Kivy.
# android.allow_backup = True

# (str) XML file for custom backup scheme, see the documentation
# android.backup_schemes = @xml/backup_scheme

# (str) Presplash of the application (image or XML layout) instead of default kivy logo.
# android.presplash_filename = %(source.dir)s/data/presplash.png

# (str) Icon of the application
# android.icon.filename = %(source.dir)s/data/icon.png

# (str) Presplash background color (for new android toolchain)
# Supported formats are: #RRGGBB #AARRGGBB or one of 'red', 'blue', 'green', 'black', 'white', 'gray', 'cyan', 'magenta', 'yellow', 'lightgray', 'darkgray', 'lightgrey', 'darkgrey', 'aqua', 'fuchsia', 'lime', 'maroon', 'navy', 'olive', 'purple', 'silver', 'teal'.
#android.presplash_bgcolor = #FFFFFF

# (list) Permissions
#android.permissions = INTERNET

# (int) Target Android API, should be as high as possible.
#android.api = 31

# (int) Minimum API your APK will support.
#android.minapi = 21

# (int) Android SDK version to use
#android.sdk = 30

# (str) Android NDK version to use
#android.ndk = 23b

# (int) Android NDK API to use. This is the minimum API your native
# libraries will support.
#android.ndk_api = 21

# (bool) Use --private data storage (True) or --dir public storage (False)
#android.private_storage = True

# (str) Android app theme, default is ok for Kivy-based app
# android.theme = "@android:style/Theme.NoTitleBar"

# (bool) Copy library instead of making a libpymodules.so
#android.copy_libs = 1

# (str) The Android arch to build for, choices: armeabi-v7a, arm64-v8a, x86, x86_64
#android.archs = arm64-v8a

# (int) overrides automatic versionCode (used in build.gradle) and should only be edited if you know what you're doing
# android.version_code = 1

# (list) Pattern to whitelist for the whole project
#android.whitelist = lib-dynload/termios.so

# (str) Path to a Java .jar used to build android
#android.add_src =

# (str) launchMode to set - oneTask is default. oneTask cannot be used with singleTask
# android.launch_mode = standard

# (bool) Copy library instead of making a libpymodules.so
#android.copy_libs = 1

# (str) The Android arch to build for, choices: armeabi-v7a, arm64-v8a, x86, x86_64
#android.archs = arm64-v8a

# (bool) enables Android auto backup & restore. Disabled by default with Kivy.
# android.allow_backup = True

# (str) XML file for custom backup scheme, see the documentation
# android.backup_schemes = @xml/backup_scheme

# (str) Presplash of the application (image or XML layout) instead of default kivy logo.
# android.presplash_filename = %(source.dir)s/data/presplash.png

# (str) Icon of the application
# android.icon.filename = %(source.dir)s/data/icon.png

# (str) Presplash background color (for new android toolchain)
# Supported formats are: #RRGGBB #AARRGGBB or one of 'red', 'blue', 'green', 'black', 'white', 'gray', 'cyan', 'magenta', 'yellow', 'lightgray', 'darkgray', 'lightgrey', 'darkgrey', 'aqua', 'fuchsia', 'lime', 'maroon', 'navy', 'olive', 'purple', 'silver', 'teal'.
#android.presplash_bgcolor = #FFFFFF

# (list) Permissions
#android.permissions = INTERNET

# (int) Target Android API, should be as high as possible.
#android.api = 31

# (int) Minimum API your APK will support.
#android.minapi = 21

# (int) Android SDK version to use
#android.sdk = 30

# (str) Android NDK version to use
#android.ndk = 23b

# (int) Android NDK API to use. This is the minimum API your native
# libraries will support.
#android.ndk_api = 21

# (bool) Use --private data storage (True) or --dir public storage (False)
#android.private_storage = True

# (str) Android app theme, default is ok for Kivy-based app
# android.theme = "@android:style/Theme.NoTitleBar"

# (bool) Copy library instead of making a libpymodules.so
#android.copy_libs = 1

# (str) The Android arch to build for, choices: armeabi-v7a, arm64-v8a, x86, x86_64
#android.archs = arm64-v8a

# (int) overrides automatic versionCode (used in build.gradle) and should only be edited if you know what you're doing
# android.version_code = 1

# (list) Pattern to whitelist for the whole project
#android.whitelist = lib-dynload/termios.so

# (str) Path to a Java .jar used to build android
#android.add_src =

# (str) launchMode to set - oneTask is default. oneTask cannot be used with singleTask
# android.launch_mode = standard

# (bool) Copy library instead of making a libpymodules.so
#android.copy_libs = 1

# (str) The Android arch to build for, choices: armeabi-v7a, arm64-v8a, x86, x86_64
#android.archs = arm64-v8a

# (bool) enables Android auto backup & restore. Disabled by default with Kivy.
# android.allow_backup = True

# (str) XML file for custom backup scheme, see the documentation
# android.backup_schemes = @xml/backup_scheme

# (str) Presplash of the application (image or XML layout) instead of default kivy logo.
# android.presplash_filename = %(source.dir)s/data/presplash.png

# (str) Icon of the application
# android.icon.filename = %(source.dir)s/data/icon.png

#
# iOS specific
#

# (bool) Indicate if the application should be fullscreen or not
#ios.fullscreen = True

# (str) Path to background image (must be 320x480)
#ios.preimage = %(source.dir)s/data/ios_preimage.png

# (str) Icon to use on the iOS home screen
#ios.icon.filename = %(source.dir)s/data/icon-ios.png

# (str) Icon to use on the iOS home screen for Spotlight searches
#ios.icon.filename.spotlight = %(source.dir)s/data/icon-ios-spotlight.png

# (int) Port used for the webview in test mode. Don't change this unless you know what you're doing.
#ios.port = 8307

# Ensure you dot the i's and cross the t's for the above iOS icons.
# NOTE: when changing iOS icon, make sure to delete build-ios/My Application-Info.plist in order for the new icon to be registered.


[buildozer]

# (int) Log level (0 = error only, 1 = info, 2 = debug (with command output))
log_level = 2

# (int) Display warning upon buildozer run if buildozer.spec is older than build.gradle generated by buildozer.
# Set this to 0 to avoid the warning, or increment the value if you want more recent buildozer.spec to be used as a backup.
warn_on_root = 1
