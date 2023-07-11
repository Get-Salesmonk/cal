# To setup local dev environment
1. Install `docker desktop`
2. Install and sync env with Vercel CLI
3. Change ORGANIZATIONS_ENABLED to undefined i.e. ```ORGANIZATIONS_ENABLED=``` in `.env`
4. Install dependencies
   ```bash
   yarn
   ```
5. run the turborepo script to setup mailhog and postgres docker and start the dev server
   ```bash
   yarn dx
   ```


## Problems faced for windows users

1. ```bash
   git config --get core.symlinks
   ```
   if returns ```false```.
2. Then run 
   ```bash
   git config core.symlinks true
   ```
3. Now run the following command and confirm that it returns `true`.
    ```bash
    git config --get core.symlinks
    ```
4. Next, simply remove the .env file located in ```packages/prisma/```.
  
5. Finally, run the following command to restore the .env file but as a symbolic link
   ```bash
   git restore packages/prisma/.env
   ```
