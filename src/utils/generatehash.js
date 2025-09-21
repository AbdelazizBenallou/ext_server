const argon2 = require("argon2");

async function generateHash() {
  try {
    const password = "17914518_79461382_4696565656546546546_235464684684654654654_36465468465465465";
    const hash = await argon2.hash(password);
    console.log(password);
    console.log("✅ Hash generated:", hash);
    
    
    console.log("\n📋 SQL Command:");
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE id = 8;`);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

generateHash();
