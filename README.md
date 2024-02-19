
![Screenshot 2024-02-12 192613](https://github.com/HecticKiwi/Reddot/assets/88013638/aa70f9ab-0ffd-4bc0-859a-38ae7e92317b)

## Reddot
This is my first full-stack web application, which replicates the basic features of Reddit. Users can:

- Sign in through OAuth (Google/GitHub)
- Create, join, and leave communities
- Create posts within communities
- Comment on posts and reply to comments
- Vote on posts and comments
- Customize their profile picture and profile description

View the site [here](https://hk-reddot.vercel.app/).

### Tools used

I used Next JS as the overarching framework.

#### Frontend
-  Tailwind and ShadCN for styling
-  React Query for state retention between pages, infinite scrolling, & optimistic updates
-  React Hook Form + Zod for forms & validation
-  TipTap for the rich text editor

#### Backend
-  Drizzle for the postgres ORM
-  Lucia for authentication
-  AWS S3 for image storage
