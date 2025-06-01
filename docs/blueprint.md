# **App Name**: Mercado Facil

## Core Features:

- Product Management: Enable CRUD operations for products, including name, Bs price, USD price, exchange rate, and associated user.
- Order Management: Enable CRUD operations for orders, capturing date, total in both currencies, associated user, and products.
- Dashboard Summaries: Display summaries of orders and products, providing insights into sales trends and popular items.
- Automated Currency Conversion: Consume the DolarApi to fetch the current exchange rate for BS to USD in order to automatically convert prices.
- API Fallback: Implement a mechanism to use a stored exchange rate value to ensure functionality if the DolarAPI is unavailable.
- Access Control: Use an AI tool to perform role-based permission checks, using a proxy design pattern to ensure only authorized users can delete product and order records.

## Style Guidelines:

- Primary color: Vibrant orange (#FF731D) to represent the energy and dynamism of a bustling marketplace.
- Background color: Light orange (#FFD9BD) to create a warm and inviting atmosphere.
- Accent color: Yellow-orange (#FF9F0A) to highlight important actions and call-to-action buttons.
- Use clear, modern typography for easy readability.
- Employ intuitive icons to represent products, categories, and actions for user-friendly navigation.
- Design a dynamic layout with colorful sliders on the main screen, showcasing featured products and promotions.
- Incorporate subtle animations for transitions and loading states to enhance the user experience.