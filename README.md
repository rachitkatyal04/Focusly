# Focusly - Modern GTD Productivity App

A beautiful, feature-rich React Native productivity app implementing the **Getting Things Done (GTD)** methodology with a modern, gradient-based UI design.

## Overview

Focusly transforms your productivity with proven GTD methodology, wrapped in a stunning, modern interface featuring:

- **Beautiful gradient backgrounds** for each screen
- **Smooth animations** and transitions
- **Glass-morphism design** with curved borders
- **Intuitive navigation** with context-aware filtering
- **Offline-first** with local data persistence

## Key Features

### **Smart Inbox (Capture Everything)**

- Quick capture interface for tasks, ideas, and to-dos
- Beautiful pink sunset gradient background
- Real-time input with smooth animations
- Swipe-to-delete functionality

### **Intelligent Processing (Organize & Clarify)**

- Transform inbox items into actionable next actions or projects
- Assign contexts (@computer, @home, @errands, @phone)
- Create new projects or assign to existing ones
- Smart discard option for non-actionable items
- Ocean blue gradient with glass-effect cards

### **Next Actions Hub (Engage & Execute)**

- View all actionable items in one place
- **Advanced filtering** by context and project
- Mark actions as complete with visual feedback
- Toggle between active and completed actions
- Aqua dream gradient background
- **Curved filter chips** with horizontal scrolling
- Bulk delete completed actions

### **Project Management (Track & Progress)**

- **Automatic progress tracking** based on completed actions
- **Manual progress override** with custom percentages
- Interactive progress editor with quick-set buttons
- Switch between automatic and manual progress modes
- Visual progress bars with gradient fills
- Project deletion with cascade warnings
- Purple sunset gradient theme

### **Modern UI Design**

- **Unique gradients** for each screen
- **Entrance animations** (fade-in, slide-up, scale)
- **Glass-morphism cards** with backdrop blur effects
- **Curved borders** throughout the interface
- **Shadow-free design** for clean, flat aesthetics
- **Premium navigation** with gradient tab bar

## Tech Stack

### **Frontend Framework**

- **React Native** - Cross-platform mobile development
- **Expo SDK 53** - Development platform and tools
- **React Navigation 6** - Navigation library with bottom tabs and stack navigation

### **UI & Design**

- **expo-linear-gradient** - Beautiful gradient backgrounds
- **Custom animations** with React Native's Animated API
- **Expo Vector Icons** - Comprehensive icon library
- **Glass-morphism design** patterns

### **State Management**

- **React Context + useReducer** - Centralized state management
- **GTD workflow reducer** - Handles all GTD operations
- **Real-time progress calculations**

### **Data Persistence**

- **@react-native-async-storage/async-storage** - Local data storage
- **Automatic data sync** - Seamless load/save operations
- **Offline-first architecture**

### **Development Tools**

- **Expo CLI** - Development server and build tools
- **Babel** - JavaScript transpilation
- **Expo Go** - Testing on physical devices

## Installation & Setup

### **Prerequisites**

- **Node.js** (version 16 or higher)
- **Expo Go app** (for testing on device)
- **Git** (for cloning the repository)

### **Quick Start**

1. **Clone the Repository**
   `ash
git clone https://github.com/rachitkatyal04/Focusly.git
cd focusly
`

2. **Install Dependencies**
   `ash
npm install
`

3. **Start the Development Server**
   `ash
npx expo start
`

4. **Run on Device/Emulator**
   - **Physical Device**: Scan QR code with Expo Go app
   - **Android Emulator**: Press  in terminal
   - **iOS Simulator**: Press i in terminal (macOS only)
   - **Web Browser**: Press w in terminal

### **Alternative Commands**

`ash

# Start with cleared cache

npx expo start --clear

# Start for specific platform

npx expo start --android
npx expo start --ios
npx expo start --web
`

## How to Use Focusly

### ** Getting Started with GTD**

1. ** Capture Everything**

   - Open the **Inbox** tab
   - Add any task, idea, or reminder that comes to mind
   - Don't worry about organization yet - just capture!

2. ** Process & Organize**

   - Tap any inbox item to process it
   - Decide if it's a:
     - **Next Action** (single-step task)
     - **Project** (multi-step outcome)
     - **Not actionable** (discard)

3. ** Assign Contexts**

   - Add contexts to actions:
     - @computer - Tasks requiring a computer
     - @home - Things to do at home
     - @errands - Tasks for when you're out
     - @phone - Calls to make

4. ** Execute with Confidence**

   - Use **Next Actions** tab to see what you can do
   - Filter by context based on where you are
   - Mark actions complete as you finish them

5. ** Track Project Progress**
   - Monitor automatic progress based on completed actions
   - Use manual progress for subjective milestones
   - Edit progress with the interactive slider

### ** Pro Tips**

- **Empty your inbox daily** - Process all captured items
- **Use action-oriented language** - "Call John about project" vs "John"
- **Weekly reviews** - Check projects and next actions
- **Trust the system** - Capture everything, rely on the app, not memory
- **Context switching** - Filter actions by your current situation

## App Architecture

`src/
 components/           # Reusable UI components
    AnimatedCard.js      # Animated card component
    GradientBackground.js # Gradient wrapper
 context/             # State management
    GTDContext.js       # Main app state and reducers
 navigation/          # Navigation configuration
    AppNavigator.js     # Tab and stack navigation
 screens/             # Screen components
    InboxScreen.js      # Capture interface
    NextActionsScreen.js # Action management
    ProjectsScreen.js   # Project tracking
    ProcessItemScreen.js # Item processing
 types/               # Type definitions
     index.js            # Data models`

## Design Philosophy

### **Visual Hierarchy**

- **Color-coded screens** - Each section has unique gradients
- **Consistent typography** - Bold headers with proper spacing
- **Curved elements** - Rounded corners for modern appeal
- **Subtle animations** - Enhance UX without distraction

### **User Experience**

- **Fast interactions** - Smooth 60fps animations
- **Intuitive navigation** - Clear visual feedback
- **Mobile-first** - Optimized for touch interactions
- **Clean interface** - Shadow-free, flat design

## GTD Methodology Implementation

### **Core GTD Principles**

- **Capture** - Inbox for collecting everything
- **Clarify** - Process items into actionable outcomes
- **Organize** - Context-based action management
- **Reflect** - Project progress tracking
- **Engage** - Context-aware action execution

### **Data Flow**

`
Inbox Item Process Next Action/Project Complete Archive

              Assign Context

              Filter & Execute

`

## Future Enhancements

### **Planned Features**

- **Due dates and reminders**
- **Push notifications**
- **Analytics and insights**
- **Dark mode support**
- **Cloud synchronization**
- **File attachments**
- **Weekly review prompts**

### **Advanced GTD Features**

- **Someday/Maybe lists**
- **Reference materials**
- **Area of responsibility tracking**
- **Productivity metrics**

## Contributing

We welcome contributions! Here's how you can help:

1.  **Fork the repository**
2.  **Create a feature branch**
3.  **Make your changes**
4.  **Test thoroughly**
5.  **Submit a pull request**

### **Development Guidelines**

- Follow the existing design patterns
- Maintain animation consistency
- Test on both iOS and Android
- Update documentation for new features

## License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## Acknowledgments

- **David Allen** - Creator of the GTD methodology
- **React Native Community** - Amazing framework and ecosystem
- **Expo Team** - Excellent development platform
- **Contributors** - Everyone who helps improve Focusly

---

**Ready to transform your productivity? Download Focusly and start getting things done! **
