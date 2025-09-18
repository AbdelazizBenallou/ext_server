const argon2 = require("argon2");

async function generateHash() {
  try {
    const hash = await argon2.hash("17914518");
    console.log("✅ Hash generated:", hash);

    console.log("\n📋 SQL Command:");
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE id = 8;`);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

generateHash();
