export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  prompt: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'todo-app',
    name: 'Todo App',
    description: 'A simple and elegant todo application with drag-and-drop functionality',
    category: 'Productivity',
    icon: '📝',
    prompt: 'Create a modern Todo application with the following features: add new tasks, mark tasks as complete, edit tasks, delete tasks, filter tasks (all, active, completed), drag and drop to reorder tasks, and local storage persistence. Use Tailwind CSS for styling with a clean, modern design.',
    tags: ['react', 'todo', 'productivity', 'drag-drop'],
    difficulty: 'beginner',
    estimatedTime: '30 minutes'
  },
  {
    id: 'weather-dashboard',
    name: 'Weather Dashboard',
    description: 'A responsive weather dashboard showing current weather and forecasts',
    category: 'Data Visualization',
    icon: '🌤️',
    prompt: 'Create a weather dashboard that displays current weather conditions, 5-day forecast, and weather charts. Include features like search by city, temperature unit toggle (Celsius/Fahrenheit), and beautiful weather icons. Use a weather API (use mock data) and create responsive charts for temperature trends.',
    tags: ['react', 'weather', 'charts', 'api'],
    difficulty: 'intermediate',
    estimatedTime: '1 hour'
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    description: 'A modern e-commerce storefront with product listings and cart',
    category: 'E-commerce',
    icon: '🛍️',
    prompt: 'Build a modern e-commerce store with product listing, product detail pages, shopping cart functionality, product search and filter, and a checkout process. Include features like product images, prices, ratings, and a responsive design.',
    tags: ['react', 'ecommerce', 'shopping-cart', 'product-filtering'],
    difficulty: 'advanced',
    estimatedTime: '2 hours'
  },
  {
    id: 'social-media-dashboard',
    name: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media metrics and insights',
    category: 'Analytics',
    icon: '📊',
    prompt: 'Create a social media analytics dashboard with charts for followers growth, engagement metrics, post performance, and audience demographics. Include date range filters, platform selection, and export functionality for reports.',
    tags: ['react', 'analytics', 'charts', 'dashboard'],
    difficulty: 'intermediate',
    estimatedTime: '1.5 hours'
  },
  {
    id: 'recipe-finder',
    name: 'Recipe Finder',
    description: 'Discover and save your favorite recipes with search and filters',
    category: 'Lifestyle',
    icon: '🍳',
    prompt: 'Build a recipe finder application where users can search recipes by ingredients, cuisine type, or dietary restrictions. Include features like save favorite recipes, cooking time filters, difficulty levels, and beautiful recipe cards with images.',
    tags: ['react', 'recipe', 'search', 'filtering'],
    difficulty: 'intermediate',
    estimatedTime: '1 hour'
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Advanced task management with teams and projects',
    category: 'Productivity',
    icon: '📋',
    prompt: 'Create a comprehensive task management application with project organization, team collaboration, task assignment, due dates, priority levels, status tracking, and Kanban board view. Include user authentication and real-time updates.',
    tags: ['react', 'task-management', 'kanban', 'collaboration'],
    difficulty: 'advanced',
    estimatedTime: '2.5 hours'
  },
  {
    id: 'blog-platform',
    name: 'Blog Platform',
    description: 'A modern blog platform with rich text editing',
    category: 'Content',
    icon: '📝',
    prompt: 'Build a blog platform with rich text editor for creating posts, post categorization, comment system, user profiles, and post scheduling. Include features like markdown support, image uploads, and a responsive reading experience.',
    tags: ['react', 'blog', 'rich-text', 'cms'],
    difficulty: 'advanced',
    estimatedTime: '2 hours'
  },
  {
    id: 'fitness-tracker',
    name: 'Fitness Tracker',
    description: 'Track workouts and monitor fitness progress',
    category: 'Health',
    icon: '💪',
    prompt: 'Create a fitness tracking application where users can log workouts, track progress over time, set fitness goals, and view workout statistics. Include exercise library, custom workout creation, and progress charts.',
    tags: ['react', 'fitness', 'tracking', 'charts'],
    difficulty: 'intermediate',
    estimatedTime: '1.5 hours'
  },
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    description: 'Personal finance management with expense tracking',
    category: 'Finance',
    icon: '💰',
    prompt: 'Build a personal finance application for tracking income and expenses, categorizing transactions, creating budgets, and generating financial reports. Include features like transaction history, spending analytics, and budget alerts.',
    tags: ['react', 'finance', 'tracking', 'analytics'],
    difficulty: 'intermediate',
    estimatedTime: '1 hour'
  },
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    description: 'A stunning portfolio website for developers and designers',
    category: 'Portfolio',
    icon: '🎨',
    prompt: 'Create a modern portfolio website with sections for projects, about me, skills, experience, and contact form. Include smooth animations, dark/light mode toggle, responsive design, and project filtering by technology or category.',
    tags: ['react', 'portfolio', 'animation', 'responsive'],
    difficulty: 'beginner',
    estimatedTime: '45 minutes'
  }
];

export const TEMPLATE_CATEGORIES = [
  'All',
  'Productivity',
  'Data Visualization',
  'E-commerce',
  'Analytics',
  'Lifestyle',
  'Content',
  'Health',
  'Finance',
  'Portfolio'
];

export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-500' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-500' }
];