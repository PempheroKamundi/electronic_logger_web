# HOS Compliance Calculator


## Overview

Can view it here : https://web-production-03ad.up.railway.app/

The HOS (Hours of Service) Compliance Calculator is a sophisticated web application designed to help truck drivers and logistics professionals track and manage their driving hours, route planning, and compliance with transportation regulations.

## 🚀 Key Features

### Location Tracking
![Location Tracking](/images/location-tracking.png)
- **Flexible Input**: Switch between address and coordinate input modes
- **Address Autocomplete**: Intelligent address suggestions using OpenStreetMap Nominatim API
- **Coordinate Input**: Precise location entry with latitude and longitude

### Route Visualization
![Route Visualization](/images/route-visualization.png)
- **Interactive Map**: Detailed route tracking using Leaflet maps
- **Dynamic Route Rendering**: Visualize entire journey with start, end, and intermediate points
- **City Markers**: Highlight major cities along the route

### Hours of Service (HOS) Tracking
![HOS Tracking](/images/hos-tracking.png)
- **Comprehensive Log Visualization**: Graphical representation of driver activities
- **Status Tracking**: Monitor off-duty, sleeper berth, driving, and on-duty statuses
- **Compliance Calculation**: Track 14-hour duty window, 11 hours driving, and 10 hours rest periods

### User Experience
![User Experience](/images/user-experience.png)
- **Local Storage**: Save and retrieve previous location data
- **Timezone Awareness**: Automatically adjusts for user's local timezone
- **Responsive Design**: Works seamlessly across devices

### Error Handling
- **Detailed Error Messages**: Informative error notifications
- **Route Retry Mechanism**: Easy recovery from routing errors

## 🛠 Technology Stack

- **Frontend**: React 19
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet, React-Leaflet
- **State Management**: React Hooks
- **Geocoding**: OpenStreetMap Nominatim API
- **Build Tool**: Vite
- **TypeScript**: Strict type checking

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/hos-compliance-calculator.git
cd hos-compliance-calculator
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

## 📦 Environment Configuration

- Create a `.env` file with:
```
VITE_MAIN_SITE_URL=https://your-backend-url.com
```

## 🚧 Future Improvements

1. **Testing**
   - Implement comprehensive unit tests
   - Add integration tests for routing and HOS calculations
   - Develop end-to-end testing suite

2. **Printing Capabilities**
   - Add PDF generation for logs
   - Create printable route and HOS reports
   - Implement export functionality for logs


3. **Performance Optimizations**
   - Implement code splitting
   - Optimize map rendering
   - Improve geocoding request caching


## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

