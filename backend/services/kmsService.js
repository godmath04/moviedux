const { KeyManagementServiceClient } = require("@google-cloud/kms");

// ✅ Clase para encapsular el servicio
class KmsService {
  constructor(keyPath) {
    // Inicializa el cliente con la ruta de la clave
    this.client = new KeyManagementServiceClient({
      keyFilename: keyPath,
    });

    // Define la ruta completa de la clave KMS
    this.keyName = this.client.cryptoKeyPath(
      "dark-star-465316-e8", // Project ID
      "global", // Ubicación
      "blogcore-keyring", // Key Ring
      "articulo-key" // Crypto Key
    );
  }

  // 🔓 Método para desencriptar contenido base64
  async desencriptar(contenidoCifrado) {
    const [result] = await this.client.decrypt({
      name: this.keyName,
      ciphertext: Buffer.from(contenidoCifrado, "base64"),
    });

    return result.plaintext.toString("utf8");
  }
}

module.exports = KmsService;
