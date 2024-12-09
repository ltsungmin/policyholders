# Policyholder

作者: Andy Lee

## 成果

- 使用 Mock API 模擬串接功能
- 可以使用「保戶編號」搜尋保戶
- 搜尋後以該保戶為「主節點」並呈現該保戶 4 階樹狀圖
- 每個子節點以不同顏色區別「直接介紹」& 「間接介紹」客戶
- 每個子節點點擊後，會以該結點為「主節點」再呈現 4 階的介紹關係
- 每個子節點點擊後，可以取得上一階的資料


## 技術使用

- Next.js 
- 使用 TypeScript
- D3.js 渲染樹狀結構
- Shadcn UI Library
- eslint, prettier, eslint 統一程式碼風格
- API Routes 創建 Mock API

## 專案架構

- src
  - app
    - api：API創建
    - (policyholders)：前端頁面 render
  - components
  - constants
  - utils
  - models
  - services
  - type

## Local 啟動方法

安裝

```bash
pnpm install
# or
yarn install
```

啟動服務

```bash
pnpm start
# or
yarn start
```
