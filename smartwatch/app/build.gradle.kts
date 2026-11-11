plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.coco.smartwatch"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.coco.smartwatch"
        minSdk = 30
        targetSdk = 36
        versionCode = 1
        versionName = "0.1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // Backend base URL — override with your local IP during development.
        // Example for emulator:  http://10.0.2.2:8080/
        // Example for real device: http://192.168.x.x:8080/
        // Set the BACKEND_URL environment variable in CI / local.properties to change this.
        buildConfigField(
            "String",
            "BACKEND_URL",
            "\"${System.getenv("BACKEND_URL") ?: "http://10.0.2.2:8080/"}\""
        )

        // Modo demo (opcional): si ambas variables existen al compilar, la app entra sola a esa cuenta
        // y oculta el inicio de sesión. No se guardan en el repositorio; quedan dentro del APK generado.
        buildConfigField("String", "DEMO_EMAIL", "\"${System.getenv("DEMO_EMAIL") ?: ""}\"")
        buildConfigField("String", "DEMO_PASSWORD", "\"${System.getenv("DEMO_PASSWORD") ?: ""}\"")

        // Placeholder rabbit ID — will be replaced by the authenticated user's rabbit in week 5.
    }

    // Local backend URLs use HTTP. Allow it only in debug builds; release builds
    // must use HTTPS so test configuration cannot weaken the shipped app.
    buildTypes {
        debug {
            manifestPlaceholders["usesCleartextTraffic"] = "true"
        }
        release {
            manifestPlaceholders["usesCleartextTraffic"] = "false"
        }
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }

    ksp {
        arg("room.schemaLocation", "$projectDir/schemas")
        arg("room.incremental", "true")
    }

    // El modelo de voz se lee tal cual desde assets; comprimirlo solo gasta tiempo.
    androidResources { noCompress += listOf("mdl", "fst", "int", "conf", "mat", "stats", "dubm", "ie", "txt") }

    testOptions { unitTests.isReturnDefaultValues = true }
}

dependencies {
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.foundation)
    implementation(libs.compose.material3)
    implementation(libs.compose.ui.tooling.preview)
    implementation(libs.activity.compose)
    implementation(libs.wear.compose.material3)
    implementation(libs.wear.compose.foundation)
    implementation(libs.wear.compose.navigation)
    implementation(libs.navigation.compose)
    implementation(libs.lifecycle.runtime.compose)
    implementation(libs.lifecycle.viewmodel.compose)
    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.gson)
    implementation(libs.okhttp.logging)
    implementation(libs.security.crypto)
    implementation(libs.vosk.android)
    ksp(libs.room.compiler)
    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
    debugImplementation(libs.compose.ui.tooling)
}
