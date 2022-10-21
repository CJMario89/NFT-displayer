NFT-Displayer

What is the project for?

To connect with Web3, 

You can Connect your wallet and view your wallet info and NFTs on multiple chains(ETH, BSC, Polygon) and read the metadata, attributes ,owners ,IDs that tokenAddress launched, etc by clicking them and read the contrac. You can also transfer NFTs in it and refresh data to see the lastest status of NFTs.


How to build the project up ?

env: "react": "^18.2.0",, "express": "^4.18.2"

1. git clone https://github.com/CJMario89/NFT-displayer.git
2. cd NFT-displayer
3. npm install 
    (for express.js)
4. cd client
5. npm install
    (for react.js)
6. cd ..
7. npm start
(run on localhost:5000)


1. setup dependency (https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
2. Heroku login
3. cd NFT-displayer
4. Heroku create 
5. git push heroku main
6. heroku ps:scale web=1
7. heroku open
(Heroku)