package com.assignmate.homeworkplanner.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColors = lightColorScheme(
    primary = Color(0xFF2196F3),      // Blue
    secondary = Color(0xFF03DAC6),    // Teal
    tertiary = Color(0xFF3700B3),     // Purple
    background = Color(0xFFFAFAFA),   // Light Gray
    surface = Color(0xFFFFFFFF),      // White
    error = Color(0xFFB00020),        // Red
    onPrimary = Color(0xFFFFFFFF),    // White
    onSecondary = Color(0xFF000000),  // Black
    onBackground = Color(0xFF1C1B1F), // Dark Gray
    onSurface = Color(0xFF1C1B1F),    // Dark Gray
    onError = Color(0xFFFFFFFF)       // White
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFF90CAF9),      // Light Blue
    secondary = Color(0xFF80DEEA),    // Light Teal
    tertiary = Color(0xFFB39DDB),     // Light Purple
    background = Color(0xFF121212),   // Dark Gray
    surface = Color(0xFF1E1E1E),      // Darker Gray
    error = Color(0xFFCF6679),        // Light Red
    onPrimary = Color(0xFF000000),    // Black
    onSecondary = Color(0xFF000000),  // Black
    onBackground = Color(0xFFE6E1E5), // Light Gray
    onSurface = Color(0xFFE6E1E5),    // Light Gray
    onError = Color(0xFF000000)       // Black
)

@Composable
fun HomeworkPlannerTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColors
        else -> LightColors
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
