# ChamaBebidas Entregador

App Expo/React Native do entregador ChamaBebidas.

## Recursos

- Busca pedidos reais em `https://chamabebidas.com.br/api/orders`
- Aceita entrega via `PUT /api/orders/:id`
- Confirma retirada com `pinRetirada`
- Confirma entrega com `deliveryCode`
- Atualiza status para `driver_accepted`, `picked_up` e `delivered`

## Rodar localmente

```bash
npm install
npx expo start
```

## Gerar Android

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

## Pacote Android

`com.chamabebidas.entregador`
