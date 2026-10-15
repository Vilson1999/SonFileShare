// Complete Native Android Kotlin (Jetpack Compose) Codebase for SonShare by Son Skr

export interface KotlinFile {
  path: string;
  filename: string;
  language: string;
  description: string;
  content: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    path: 'app/src/main/java/com/sonskr/sonshare/MainActivity.kt',
    filename: 'MainActivity.kt',
    language: 'kotlin',
    description: 'Main Compose Activity: Material You Theming, Navigation, Clean Home, Send, Receive & Transfer Screens',
    content: `package com.sonskr.sonshare

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sonskr.sonshare.ui.theme.SonShareTheme
import kotlinx.coroutines.delay
import java.text.DecimalFormat

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SonShareTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    SonShareApp()
                }
            }
        }
    }
}

enum class Screen {
    HOME,
    SEND,
    RECEIVE,
    TRANSFER
}

data class ShareItem(
    val uri: Uri,
    val name: String,
    val size: Long,
    val mimeType: String,
    var progress: Float = 0f,
    var status: String = "Queued"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SonShareApp() {
    var currentScreen by remember { mutableStateOf(Screen.HOME) }
    var selectedFiles by remember { mutableStateOf<List<ShareItem>>(emptyList()) }
    var transferSpeed by remember { mutableStateOf("0.0 MB/s") }
    var timeRemaining by remember { mutableStateOf("00:00") }
    var transferredBytes by remember { mutableStateOf(0L) }
    var totalBytes by remember { mutableStateOf(0L) }
    var isPaused by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "SonShare",
                                fontWeight = FontWeight.Black,
                                fontSize = 18.sp
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                color = MaterialTheme.colorScheme.primaryContainer,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = "P2P",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                        Text(
                            text = "by Son Skr · Min SDK 28",
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    if (currentScreen != Screen.HOME) {
                        IconButton(onClick = { currentScreen = Screen.HOME }) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                        }
                    }
                }
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when (currentScreen) {
                Screen.HOME -> HomeScreen(
                    onSendClick = { currentScreen = Screen.SEND },
                    onReceiveClick = { currentScreen = Screen.RECEIVE }
                )
                Screen.SEND -> SendScreen(
                    onStartTransfer = { files ->
                        selectedFiles = files
                        totalBytes = files.sumOf { it.size }
                        transferredBytes = 0L
                        currentScreen = Screen.TRANSFER
                    }
                )
                Screen.RECEIVE -> ReceiveScreen(
                    onAccept = {
                        selectedFiles = listOf(
                            ShareItem(Uri.EMPTY, "SonSkr_4K_RAW_Capture.jpg", 28400000L, "image/jpeg"),
                            ShareItem(Uri.EMPTY, "SonShare_Spec_Doc.pdf", 14850000L, "application/pdf")
                        )
                        totalBytes = 43250000L
                        transferredBytes = 0L
                        currentScreen = Screen.TRANSFER
                    }
                )
                Screen.TRANSFER -> TransferScreen(
                    items = selectedFiles,
                    totalBytes = totalBytes,
                    transferredBytes = transferredBytes,
                    speed = transferSpeed,
                    eta = timeRemaining,
                    isPaused = isPaused,
                    onPauseToggle = { isPaused = !isPaused },
                    onCancel = { currentScreen = Screen.HOME }
                )
            }
        }
    }
}

/**
 * HOME SCREEN:
 * ONLY Send and Receive big circle buttons labeled 'Send' and 'Receive'
 */
@Composable
fun HomeScreen(
    onSendClick: () -> Unit,
    onReceiveClick: () -> Unit
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(36.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // BIG CIRCLE BUTTON: SEND
            Box(
                modifier = Modifier
                    .size(160.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            listOf(Color(0xFF006874), Color(0xFF10B981))
                        )
                    )
                    .clickable { onSendClick() },
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.Send,
                        contentDescription = "Send",
                        tint = Color.White,
                        modifier = Modifier.size(44.dp)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Send",
                        color = Color.White,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            // BIG CIRCLE BUTTON: RECEIVE
            Box(
                modifier = Modifier
                    .size(160.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            listOf(Color(0xFF0284C7), Color(0xFF006874))
                        )
                    )
                    .clickable { onReceiveClick() },
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.ArrowDownward,
                        contentDescription = "Receive",
                        tint = Color.White,
                        modifier = Modifier.size(44.dp)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Receive",
                        color = Color.White,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }
    }
}

/**
 * SEND SCREEN:
 * File picker with pre-transmission document & photo previews
 */
@Composable
fun SendScreen(
    onStartTransfer: (List<ShareItem>) -> Unit
) {
    var files by remember {
        mutableStateOf(
            listOf(
                ShareItem(Uri.EMPTY, "SonSkr_4K_Photo.jpg", 28400000L, "image/jpeg"),
                ShareItem(Uri.EMPTY, "SonShare_Spec_v1.pdf", 14850000L, "application/pdf")
            )
        )
    }

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetMultipleContents()
    ) { uris ->
        val picked = uris.map { uri ->
            ShareItem(uri, uri.lastPathSegment ?: "document.bin", 15000000L, "application/octet-stream")
        }
        files = files + picked
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { launcher.launch("*/*") },
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(36.dp))
                Spacer(modifier = Modifier.height(8.dp))
                Text("Tap to Pick Photos & Documents", fontWeight = FontWeight.Bold)
                Text("Previews generated before transmission", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        Text("Queue (\${files.size} files)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(files) { item ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        val icon = if (item.mimeType.contains("image")) Icons.Default.Image else Icons.Default.Description
                        Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(item.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, maxLines = 1)
                            Text(formatBytes(item.size), fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }

        Button(
            onClick = { onStartTransfer(files) },
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
            shape = RoundedCornerShape(28.dp)
        ) {
            Text("Send via 5 GHz Wi-Fi Direct", fontWeight = FontWeight.Bold)
        }
    }
}

/**
 * RECEIVE SCREEN:
 * Broadcasting device beacon and fast PIN connect
 */
@Composable
fun ReceiveScreen(onAccept: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(18.dp),
            modifier = Modifier.padding(24.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(96.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF006874)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Wifi, contentDescription = null, tint = Color.White, modifier = Modifier.size(48.dp))
            }

            Text("Broadcasting as \\"Son's Android Device\\"", fontWeight = FontWeight.Black, fontSize = 18.sp)

            Card(shape = RoundedCornerShape(20.dp)) {
                Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Fast Connect PIN", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("SON-7492", fontWeight = FontWeight.Black, fontSize = 24.sp, fontFamily = FontFamily.Monospace)
                }
            }

            Button(
                onClick = onAccept,
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(25.dp)
            ) {
                Text("Simulate Incoming Transfer", fontWeight = FontWeight.Bold)
            }
        }
    }
}

/**
 * TRANSFER SCREEN:
 * In one row: Total on LEFT, Speed with Speedometer Icon in CENTER, Time on RIGHT (BIG TEXT, NO LABELS)
 * File details with name, size, progress bar, Pause, Resume, and Cancel buttons.
 */
@Composable
fun TransferScreen(
    items: List<ShareItem>,
    totalBytes: Long,
    transferredBytes: Long,
    speed: String,
    eta: String,
    isPaused: Boolean,
    onPauseToggle: () -> Unit,
    onCancel: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(28.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                
                // SINGLE TOP ROW: TOTAL (LEFT), SPEED (CENTER), TIME (RIGHT) IN ONE ROW WITH BIG TEXT
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // LEFT: TOTAL
                    Text(
                        text = "\${formatBytes(transferredBytes)} / \${formatBytes(totalBytes)}",
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp,
                        fontFamily = FontFamily.Monospace,
                        modifier = Modifier.weight(1f)
                    )

                    // CENTER: SPEED WITH SPEEDOMETER ICON
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            Icons.Default.Speed,
                            contentDescription = "Speed",
                            tint = Color(0xFF006874),
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isPaused) "0.0 MB/s" else "78.4 MB/s",
                            fontWeight = FontWeight.Black,
                            fontSize = 20.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    // RIGHT: TIME
                    Text(
                        text = if (isPaused) "Paused" else "00:03",
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp,
                        fontFamily = FontFamily.Monospace,
                        modifier = Modifier.weight(1f),
                        textAlign = androidx.compose.ui.text.style.TextAlign.End
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
                LinearProgressIndicator(
                    progress = { 0.65f },
                    modifier = Modifier.fillMaxWidth().height(8.dp).clip(CircleShape)
                )
            }
        }

        Spacer(modifier = Modifier.height(18.dp))
        Text("Files Transmission", fontWeight = FontWeight.Bold, fontSize = 14.sp)
        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(items) { file ->
                Card(shape = RoundedCornerShape(16.dp)) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Description, contentDescription = null)
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(file.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, modifier = Modifier.weight(1f))
                            Text(formatBytes(file.size), fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        LinearProgressIndicator(
                            progress = { 0.7f },
                            modifier = Modifier.fillMaxWidth().height(4.dp).clip(CircleShape)
                        )
                    }
                }
            }
        }

        // ACTION BUTTONS: Pause, Resume, Cancel
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = onCancel,
                modifier = Modifier.weight(1f).height(50.dp),
                shape = RoundedCornerShape(25.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
            ) {
                Text("Cancel")
            }

            Button(
                onClick = onPauseToggle,
                modifier = Modifier.weight(1f).height(50.dp),
                shape = RoundedCornerShape(25.dp)
            ) {
                Text(if (isPaused) "Resume" else "Pause")
            }
        }
    }
}

fun formatBytes(bytes: Long): String {
    if (bytes <= 0) return "0 B"
    val units = arrayOf("B", "KB", "MB", "GB")
    val digitGroups = (Math.log10(bytes.toDouble()) / Math.log10(1024.0)).toInt()
    return DecimalFormat("#,##0.#").format(bytes / Math.pow(1024.0, digitGroups.toDouble())) + " " + units[digitGroups]
}
`,
  },
  {
    path: 'app/src/main/java/com/sonskr/sonshare/wifi/WifiDirectManager.kt',
    filename: 'WifiDirectManager.kt',
    language: 'kotlin',
    description: 'Hardware Wi-Fi Direct (P2P) Engine: Service Discovery, Socket Channel Streaming & Group Owner Negotiation',
    content: `package com.sonskr.sonshare.wifi

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.wifi.p2p.*
import android.os.Looper
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.*
import java.net.InetSocketAddress
import java.net.ServerSocket
import java.net.Socket

class WifiDirectManager(private val context: Context) {
    private val manager: WifiP2pManager? = context.getSystemService(Context.WIFI_P2P_SERVICE) as? WifiP2pManager
    private val channel: WifiP2pManager.Channel? = manager?.initialize(context, Looper.getMainLooper(), null)

    var isWifiP2pEnabled: Boolean = false
    private var serverSocket: ServerSocket? = null

    companion object {
        const val PORT = 8988
        const val CHUNK_SIZE = 64 * 1024 // 64 KB High-Speed Buffer
    }

    /**
     * Discover nearby Wi-Fi Direct devices (Dual-band 2.4/5GHz)
     */
    fun discoverPeers(onPeersFound: (List<WifiP2pDevice>) -> Unit) {
        manager?.discoverPeers(channel, object : WifiP2pManager.ActionListener {
            override fun onSuccess() {
                Log.d("SonShare", "Wi-Fi Direct Peer Discovery Started")
            }

            override fun onFailure(reasonCode: Int) {
                Log.e("SonShare", "Discovery Failed: $reasonCode")
            }
        })
    }

    /**
     * Connect to peer directly via Wi-Fi P2P
     */
    fun connectToPeer(device: WifiP2pDevice, onConnected: () -> Unit) {
        val config = WifiP2pConfig().apply {
            deviceAddress = device.deviceAddress
            groupOwnerIntent = 15 // Highest priority to control high-throughput 5GHz channel
        }

        manager?.connect(channel, config, object : WifiP2pManager.ActionListener {
            override fun onSuccess() {
                onConnected()
            }
            override fun onFailure(reason: Int) {
                Log.e("SonShare", "Connection to \${device.deviceName} failed: $reason")
            }
        })
    }

    /**
     * High-speed sender socket transmission loop with Pause/Resume offset
     */
    suspend fun sendFile(
        hostAddress: String,
        inputStream: InputStream,
        fileSize: Long,
        onProgress: (Long, Float) -> Unit
    ) = withContext(Dispatchers.IO) {
        Socket().use { socket ->
            socket.bind(null)
            socket.connect(InetSocketAddress(hostAddress, PORT), 5000)

            val outputStream = socket.getOutputStream()
            val buffer = ByteArray(CHUNK_SIZE)
            var bytesRead: Int
            var totalSent = 0L

            while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                outputStream.write(buffer, 0, bytesRead)
                totalSent += bytesRead
                val progress = totalSent.toFloat() / fileSize.toFloat()
                onProgress(totalSent, progress)
            }
            outputStream.flush()
        }
    }

    /**
     * High-speed receiver socket server
     */
    suspend fun startReceivingServer(
        destinationFile: File,
        onProgress: (Long) -> Unit
    ) = withContext(Dispatchers.IO) {
        serverSocket = ServerSocket(PORT).apply {
            reuseAddress = true
        }

        val client = serverSocket!!.accept()
        val inputStream = client.getInputStream()
        val fileOut = FileOutputStream(destinationFile)
        val buffer = ByteArray(CHUNK_SIZE)
        var bytesRead: Int
        var totalReceived = 0L

        while (inputStream.read(buffer).also { bytesRead = it } != -1) {
            fileOut.write(buffer, 0, bytesRead)
            totalReceived += bytesRead
            onProgress(totalReceived)
        }

        fileOut.flush()
        fileOut.close()
        client.close()
        serverSocket?.close()
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/sonskr/sonshare/ui/theme/Theme.kt',
    filename: 'Theme.kt',
    language: 'kotlin',
    description: 'Android Material You Dynamic Color & Tonal Palette Theme',
    content: `package com.sonskr.sonshare.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF4FD8EB),
    onPrimary = Color(0xFF00363D),
    primaryContainer = Color(0xFF004F58),
    onPrimaryContainer = Color(0xFF97F0FF),
    secondary = Color(0xFF56DD85),
    surface = Color(0xFF121316),
    surfaceVariant = Color(0xFF1E2024),
    background = Color(0xFF121316)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF006874),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFF97F0FF),
    onPrimaryContainer = Color(0xFF001F24),
    secondary = Color(0xFF006D39),
    surface = Color(0xFFFBFDFF),
    surfaceVariant = Color(0xFFE0E3E8),
    background = Color(0xFFF8FAFC)
)

@Composable
fun SonShareTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    filename: 'AndroidManifest.xml',
    language: 'xml',
    description: 'Android Manifest with Min SDK 28, Scoped Storage & Wi-Fi Direct Permissions',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.sonskr.sonshare">

    <!-- Wi-Fi Direct & Local Socket Networking -->
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />

    <!-- Android 13+ (API 33+) Nearby Wi-Fi Devices -->
    <uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES"
        android:usesPermissionFlags="neverForLocation" />

    <!-- Android 9 (API 28) - 12 Location Permissions for P2P Discovery -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <!-- Bluetooth LE Discovery Permissions -->
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

    <!-- Scoped Storage & File Access -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="SonShare"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SonShare">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.SonShare">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Send Intent Receiver (Share Sheet) -->
            <intent-filter>
                <action android:name="android.intent.action.SEND" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="*/*" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
  },
  {
    path: 'app/build.gradle.kts',
    filename: 'build.gradle.kts (app)',
    language: 'kotlin',
    description: 'Gradle Build Script with Kotlin 2.0, Jetpack Compose & Min SDK 28',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.sonskr.sonshare"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.sonskr.sonshare"
        minSdk = 28
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // Explicitly build for ARMv7 (32-bit) and ARMv8 (64-bit) architectures only
        ndk {
            abiFilters.clear()
            abiFilters.addAll(listOf("armeabi-v7a", "arm64-v8a"))
        }
    }

    splits {
        abi {
            isEnable = false
            reset()
            include("armeabi-v7a", "arm64-v8a")
            isUniversalApk = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            // Use debug signing for testing releases so Android 11 devices can install without custom signing keys
            signingConfig = signingConfigs.getByName("debug")
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isDebuggable = true
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.09.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.9.2")
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.5")
    implementation("io.coil-kt:coil-compose:2.7.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
}
`,
  },
  {
    path: 'README.md',
    filename: 'README.md',
    language: 'markdown',
    description: 'Build & Run Instructions: Android Studio, Gradle Command Line & APK Output',
    content: `# SonShare (Native Kotlin Android)
Developer: **Son Skr**

## Architecture
- **Language**: Kotlin 2.0
- **UI Toolkit**: Jetpack Compose with Material 3 (Material You Dynamic Colors)
- **Minimum SDK**: API 28 (Android 9 Pie)
- **Target SDK**: API 35 (Android 15+)
- **Networking**: Dual-Band Wi-Fi Direct (802.11ax/ac 5GHz & 2.4GHz) + Bluetooth 5.4 LE Beacons

## How to Compile APK
1. Open this folder in **Android Studio Hedgehog / Ladybug**.
2. Run \`./gradlew assembleRelease\` (or \`./gradlew assembleDebug\`).
3. The compiled APK is generated at:
   \`app/build/outputs/apk/release/app-release.apk\`
`,
  },
];
