
  # AIニュースメディアサイト

  This is a code bundle for AIニュースメディアサイト. The original project is available at https://www.figma.com/design/eHycYmRZSLbTDQUAqz2Soj/AI%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E3%82%B5%E3%82%A4%E3%83%88.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## TLS for DB (Supabase Pooler)
  - In Supabase: Settings → Database → Download certificate.
  - Save it to `certs/pooler-ca.pem` in this repo.
  - Start securely with CA: `npm run start:with-ca`.

  ## Server start modes
  - `npm run start:secure`: strict TLS verification (default trust store).
  - `npm run start:noverify`: TLS without verification (local debug only).
  
