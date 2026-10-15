package com.sonskr.sonshare

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import java.text.DecimalFormat

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
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
    var totalBytes by remember { mutableStateOf(0L) }
    var transferredBytes by remember { mutableStateOf(0L) }
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
                            text = "by Son Skr · Min SDK 28 (ARMv7 & ARMv8)",
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
                            ShareItem(Uri.EMPTY, "SonSkr_Photo_4K.jpg", 28400000L, "image/jpeg"),
                            ShareItem(Uri.EMPTY, "SonShare_Whitepaper.pdf", 14850000L, "application/pdf")
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
            horizontalArrangement = Arrangement.spacedBy(32.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // BIG CIRCLE BUTTON: SEND
            Box(
                modifier = Modifier
                    .size(150.dp)
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
                        modifier = Modifier.size(40.dp)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Send",
                        color = Color.White,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            // BIG CIRCLE BUTTON: RECEIVE
            Box(
                modifier = Modifier
                    .size(150.dp)
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
                        modifier = Modifier.size(40.dp)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Receive",
                        color = Color.White,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }
    }
}

/**
 * SEND SCREEN:
 * Pre-transmission document & photo previews
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
            ShareItem(uri, uri.lastPathSegment ?: "file.bin", 15000000L, "application/octet-stream")
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
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(32.dp))
                Spacer(modifier = Modifier.height(6.dp))
                Text("Tap to Pick Photos & Documents", fontWeight = FontWeight.Bold)
                Text("Previews before transmission", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        Text("Queue (${files.size} files)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(files) { item ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        val icon = if (item.mimeType.contains("image")) Icons.Default.Image else Icons.Default.Description
                        Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(item.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
                            Text(formatBytes(item.size), fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }

        Button(
            onClick = { onStartTransfer(files) },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            shape = RoundedCornerShape(26.dp)
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
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.padding(24.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF006874)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Wifi, contentDescription = null, tint = Color.White, modifier = Modifier.size(40.dp))
            }

            Text("Broadcasting as \\"Son's Android Device\\"", fontWeight = FontWeight.Black, fontSize = 17.sp)

            Card(shape = RoundedCornerShape(18.dp)) {
                Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Fast Connect PIN", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("SON-7492", fontWeight = FontWeight.Black, fontSize = 22.sp, fontFamily = FontFamily.Monospace)
                }
            }

            Button(
                onClick = onAccept,
                modifier = Modifier.fillMaxWidth().height(48.dp),
                shape = RoundedCornerShape(24.dp)
            ) {
                Text("Simulate Incoming Transfer", fontWeight = FontWeight.Bold)
            }
        }
    }
}

/**
 * TRANSFER SCREEN:
 * In one row: Total on LEFT, Speed with Speedometer Icon in CENTER, Time on RIGHT (BIG TEXT, NO LABELS)
 */
@Composable
fun TransferScreen(
    items: List<ShareItem>,
    totalBytes: Long,
    transferredBytes: Long,
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
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                
                // SINGLE TOP ROW: TOTAL (LEFT), SPEED (CENTER), TIME (RIGHT) IN ONE ROW WITH BIG TEXT
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // LEFT: TOTAL
                    Text(
                        text = "${formatBytes(transferredBytes)} / ${formatBytes(totalBytes)}",
                        fontWeight = FontWeight.Black,
                        fontSize = 17.sp,
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
                            modifier = Modifier.size(22.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isPaused) "0.0 MB/s" else "78.4 MB/s",
                            fontWeight = FontWeight.Black,
                            fontSize = 18.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    // RIGHT: TIME
                    Text(
                        text = if (isPaused) "Paused" else "00:03",
                        fontWeight = FontWeight.Black,
                        fontSize = 17.sp,
                        fontFamily = FontFamily.Monospace,
                        modifier = Modifier.weight(1f),
                        textAlign = androidx.compose.ui.text.style.TextAlign.End
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))
                LinearProgressIndicator(
                    progress = { 0.65f },
                    modifier = Modifier.fillMaxWidth().height(6.dp).clip(CircleShape)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        Text("Files Transmission", fontWeight = FontWeight.Bold, fontSize = 14.sp)
        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(items) { file ->
                Card(shape = RoundedCornerShape(14.dp)) {
                    Column(modifier = Modifier.padding(12.dp)) {
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
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            OutlinedButton(
                onClick = onCancel,
                modifier = Modifier.weight(1f).height(48.dp),
                shape = RoundedCornerShape(24.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
            ) {
                Text("Cancel")
            }

            Button(
                onClick = onPauseToggle,
                modifier = Modifier.weight(1f).height(48.dp),
                shape = RoundedCornerShape(24.dp)
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
