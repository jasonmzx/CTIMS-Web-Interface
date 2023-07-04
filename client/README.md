# Frontend README
**Stack** : React.js Framework

**Main NPM Libraries used**:
- THREE.js & lil-gui libraries for heavy lifting.

---
# Frontend Production Setup


1. Make sure to be in the `interface` directory
```bash
gaber@155:~/CTIMS-Web-Interface/client/interface$
```

2. Build Docker Image *(This takes several minutes on the VPS)*

```bash
docker build -t ctims-web-frontend .
```

3. 


```bash
cd ../..
docker run -p 3000:3000 -d ctims-web-frontend
```




---