import app from "./src/app.js";

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`An Nam Loi app is running at http://localhost:${port}`);
});
