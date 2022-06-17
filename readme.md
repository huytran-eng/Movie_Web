# Movie Review

## Muc dich
Trang web duong dung de tim kiem, xem tong quan, danh gia ve phim ve phim
## Su dung
### tao file .env bao gom cac thanh phan:
* SECRET - secret cua session
* MYSQL_HOST , MYSQL_USER , MYSQL_PASSWORD , MYSQL_DATABASE: cac thong tin cua mysql server
    * mysql schema gom 3 table
        * table users: user_id( INT, PK ), email( VARCHAR(45) ), username(VARCHAR(45) ), password( VARCHAR(100) )
        * table comments: user_id( INT, PK ), movie_id( INT ), text( VARCHAR(45) )
        * table user_and_movies: user_id( INT, PK ) , movie_id( INT, PK ) , status( VARCHAR(45 )
* API_KEY:a1f43d17c08b71cc18539a91f88e709b 