# Homework Planner App

A simple and effective homework management app built with Expo React Native.

## Features

- ✅ **Add Homework**: Create new homework assignments with title, subject, description, due date, and priority
- ✅ **View Homework**: See all your homework in a clean, organized list
- ✅ **Mark Complete**: Easily mark homework as completed
- ✅ **Delete Homework**: Remove homework you no longer need
- ✅ **Search & Filter**: Find specific homework or filter by status (All, Pending, Completed, Overdue)
- ✅ **Statistics**: View counts of pending, completed, and overdue homework
- ✅ **Local Storage**: All data is stored locally using SQLite
- ✅ **Settings**: Manage app preferences and data

## Tech Stack

- **Framework**: Expo React Native
- **Navigation**: React Navigation
- **Database**: Expo SQLite
- **Icons**: Expo Vector Icons
- **Date Handling**: date-fns
- **UI**: React Native components with custom styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your phone (for testing)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on your device**:
   - Open Expo Go app on your phone
   - Scan the QR code that appears in the terminal
   - The app will load on your device

### Alternative: Run on Android Emulator

1. **Install Android Studio** and set up an emulator
2. **Run the app**:
   ```bash
   npm run android
   ```

## Project Structure

```
├── App.js                 # Main app component with navigation
├── screens/
│   ├── HomeScreen.js      # Dashboard with stats and homework list
│   ├── AddHomeworkScreen.js # Form to add new homework
│   ├── HomeworkListScreen.js # All homework with search/filter
│   └── SettingsScreen.js  # App settings and data management
├── package.json           # Dependencies and scripts
└── app.json              # Expo configuration
```

## How to Use

1. **Add Homework**: Tap the "+" tab and fill out the form
2. **View Homework**: Use the "Home" tab to see your dashboard
3. **Manage Homework**: Use the "List" tab to search and filter homework
4. **Settings**: Use the "Settings" tab to manage app preferences

## Features in Detail

### Home Screen
- Overview of all homework
- Statistics (pending, completed, overdue)
- Quick actions to mark complete/delete

### Add Homework Screen
- Title (required)
- Subject (optional)
- Description (optional)
- Due date picker
- Priority selection (Low, Medium, High)

### List Screen
- Search functionality
- Filter by status
- Sort by due date
- Complete/delete actions

### Settings Screen
- Toggle notifications
- Toggle dark mode
- Export data
- Clear completed homework
- Clear all data

## Database Schema

The app uses SQLite with the following table structure:

```sql
CREATE TABLE homework (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subject TEXT,
  description TEXT,
  dueDate TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  isCompleted INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
