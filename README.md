This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Home Dashboard

家用電子紙主控板

讓電子紙螢幕顯示透過伺服器渲染好的畫面

## Demo

#### 家庭主控板

![](/public/board-1.png)

#### 貨幣

![](/public/currency.png)

#### 貨幣 - 樣式二

![](/public/currency-2.png)

## 部署指南

```bash
docker run -d --name nocodb-einvoice \
  -e WEATHER_LAT=25.033 \
  -e WEATHER_LON=121.5654 \
  -e NEXT_PUBLIC_INVERT_COLOR=false \
  ghcr.io/gnehs/home-dashboard:latest
```

透過此方式部署的 Home Dashboard 由於 Home Assistant 裝置 ID 進行修改，「家庭監測面板」將會顯示錯誤，可參考下方開發指南進行開發

## 在電子紙上顯示畫面

若你已成功部署，可參考 `esphome.lilyt5.example.yaml` 並進行修改來讓渲染好的圖片顯示在裝置。

## 開發指南

由於內建的圖片有許多東西需要自訂，建議 Fork 後進行修改，否則部分的圖片將因 API 無法連線導致發生錯誤

### 0. Fork

按下右上角 Fork，複製程式碼到你的帳號下

### 1. 修改 Home Dashboard 程式碼

#### 1-1. 修改 `.github/workflows/build.yaml`

這裡已有撰寫好的 GitHub Actions，需要將 Docker 的使用者名稱和映像名稱更改為你的資訊，完成後將會在每次推送時自動建置 Docker 映像

`gnehs/home-dashboard` -> `<yout_username>/<image_name>`

#### 1-2. 修改 `app/img/board-1/route.tsx`（選用）

若你需要使用「家庭監測面板」這張圖片，需要對其進行修改

- 將 ID 更換為你的 Home Assistant 內裝置 ID，並修改相關狀態
- 適當調整版面內容

#### 1-3. 建立自訂圖片（選用）

如果你有 `HTML` 與 `CSS` 相關經驗，你可以自行參考內建圖片來建立新的自訂圖片，僅需在 `/app/img` 下複製資料夾並命名為想要的名稱即可

#### 1-4. 參考 `.env.example` 建立環境變數

請參考 `.env.example` 建立環境變數 `.env`

- 所在地座標（預設台北）
  - `WEATHER_LAT`=25.033
  - `WEATHER_LON`=121.5654
- 是否將圖片渲染為負片（`true`|`false`）
  - `NEXT_PUBLIC_INVERT_COLOR`=true

若你需要使用「家庭監測面板」這張圖片，需要填寫以下變數：

- [Home Assistant](https://www.home-assistant.io/) 相關
  - `HOME_ASSISTANT_HOST`
  - `HOME_ASSISTANT_TOKEN`
- [餅餅踏踏](https://github.com/gnehs/StepStep)
  - `STEPSTEP_HOST`
  - `STEPSTEP_TOKEN`

#### 1-5. 在本機執行開發用伺服器

請測試看看圖片是否渲染正常

```bash
pnpm i
pnpm dev
```

### 2. 推送並讓 GitHub 自動建置映像

### 3. 部署

參考上方「部署指南」中的指令並將相關參數修改為你的映像名稱
