# 01. HELLO CLASS

![alt text](./assets/01.HELLO.png)

# 02. WORK QUEUES

![alt text](./assets/02.WORK-QUEUES.png)

# 03. PUB/SUB

![alt text](./assets/03.PUB-SUB.png)

# 04. ROUTING

![alt text](./assets/04.ROUTING.png)

# 05. TOPICS

![alt text](./assets/05.TOPIC.png)


# 06. RPC ( Remote Procedure Call )

![alt text](./assets/06.RPC-New.png)

# 07. DLX ( Dead Letter Exchange )

![alt text](./assets/07.DLX.png)

# 08. EVENLY-DIST ( Evenly Distributing )

![alt text](./assets/08.EVENLY-DIST.png)

# 09. HEADERS

![alt text](./assets/09.HEADER.png)

# 10. STREAM ( New )

```
         ┌───────────────────┐
         │     Producer      │
         │  (produce.js)     │
         └───────────────────┘
                   |
                   v
        ┌──────────────────────────┐
        │   Stream Queue (Rabbit)  │
        │   type=stream            │
        │   giữ tất cả message     │
        └──────────────────────────┘
                   |
                   v
        ┌──────────────────────────┐
        │       Consumer           │
        │    (consume.js)          │
        └──────────────────────────┘
                   |
        ┌──────────────────────────┐
        │ Data Warehouse (file)    │
        │ dataWarehouse.txt        │
        └──────────────────────────┘
                   |
        ┌──────────────────────────┐
        │ Offset Checkpoint         │
        │ offset.txt                │
        └──────────────────────────┘


```

# 11. DELAYED ( New )

```
          ┌────────────────┐
          │   Producer     │
          └────────────────┘
                   |
                   v
          ┌─────────────────────────────┐
          │   delay_queue_10s           │
          │  (TTL = 10s, DLX → main_ex) │
          └─────────────────────────────┘
                   |
   (Message giữ trong queue 10s)
                   |
      TTL hết hạn (10s trôi qua)
                   |
                   v
          ┌─────────────────────────────┐
          │        main_exchange        │
          │   (direct, routing key=go)  │
          └─────────────────────────────┘
                   |
                   v
          ┌─────────────────────────────┐
          │   delayed_target_queue      │
          │   (nơi Consumer lắng nghe)  │
          └─────────────────────────────┘
                   |
                   v
          ┌────────────────┐
          │   Consumer     │
          │ [✓] nhận msg   │
          └────────────────┘

```

# 12. DLX ( New )

```
            +------------------+
            |   Producer       |
            | (DXL function)   |
            +--------+---------+
                     |
                     v
            +------------------+
            |  main_queue      |<-------------------+
            | (TTL = 5s)       |                    |
            | DLX = dlx_exchange                    |
            +--------+---------+                    |
                     |                              |
         (msg expired or rejected)                  |
                     |                              |
                     v                              |
            +------------------+                    |
            |  dlx_exchange    | (fanout exchange)  |
            +--------+---------+                    |
                     |                              |
                     v                              |
            +------------------+                    |
            | dead_letter_queue|--------------------+
            +------------------+


```

# 13. WORK ( New )

```
   +-------------+          +----------------+        +----------------+
   |             |   task   |                |        |                |
   |  Producer   +--------->+   Queue (tasks)+------->+  Worker 1      |
   |             |          |                |        | (Consumer)     |
   +-------------+          +----------------+        +----------------+
                                                      ^
                                                      |
                                                      |
                                                      v
                                               +----------------+
                                               |  Worker 2      |
                                               | (Consumer)     |
                                               +----------------+

```

# 14. TTL ( New )

```
   [Producer]
       |
       v
 ┌───────────────┐
 │  Queue (msg_ttl_queue) │
 └───────────────┘
       |
       | Message có TTL=5s
       |--------------------------> Nếu Consumer đọc trong 5s → xử lý OK
       |
       └──> Sau 5s -> Message tự động expire -> bị xóa khỏi queue


```

# 15. PRIORITY ( New )

```
                +-------------------+
                |   Producer App    |
                +-------------------+
                         |
     -------------------------------------------------
     |                       |                       |
     v                       v                       v
[Normal ticket]         [VIP ticket]         [Medium ticket]
 priority = 1           priority = 10         priority = 5
     |                       |                       |
     -------------------------+-----------------------+
                               v
                     ┌──────────────────┐
                     │ Priority Queue   │
                     │ (x-max-priority=10)
                     └──────────────────┘
                               |
                               v
                     +--------------------+
                     |   Consumer App     |
                     | (reads by priority)|
                     +--------------------+
                               |
           --------------------------------------------
           |                  |                       |
           v                  v                       v
   Process VIP          Process Medium           Process Normal
      (10)                   (5)                      (1)


```

# 16. EMAIL-RETRY-DLX
```
          ┌─────────────────────┐
          │   Producer Service  │
          │  (Gửi request email)│
          └─────────┬───────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │   Exchange chính (direct)│
        │   email_exchange         │
        └──────────┬──────────────┘
                   │
                   ▼
         ┌──────────────────────┐
         │ Queue chính          │
         │ email_queue          │
         │ (x-dead-letter-ex=dlx│
         │  , x-message-ttl=5s) │
         └─────────┬────────────┘
                   │
             Consumer Service
                   │
         ┌─────────▼───────────┐
         │  Gửi email thực tế  │
         └─────────┬───────────┘
                   │
          ┌────────▼─────────┐
          │ Thành công        │
          │ (ACK, xóa khỏi Q) │
          └───────────────────┘

          ┌─────────────────────┐
          │ Thất bại (NACK/TTL) │
          └─────────┬───────────┘
                    ▼
        ┌──────────────────────────┐
        │ Dead Letter Exchange (DLX)│
        └──────────┬───────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │ Retry Queue (retry_queue)│
        │ TTL=10s, DLX=email_ex    │
        └──────────┬───────────────┘
                   │
                   ▼
        (sau TTL → chuyển về email_exchange → email_queue thử lại)


```

```
    📝 Giải thích ngắn gọn

    Producer gửi message vào email_exchange.

    email_queue nhận message, consumer sẽ xử lý (gửi email thật).

    Nếu gửi thành công → ACK → message biến mất.

    Nếu gửi thất bại (timeout, lỗi SMTP, …):

    Message sẽ chuyển sang DLX (dlx_exchange).

    DLX đưa message vào retry_queue.

    Sau khi hết TTL (ví dụ 10s), RabbitMQ tự động chuyển lại message về email_exchange để retry.

    Nếu retry quá số lần (ví dụ 3 lần), message sẽ đi vào dead_queue (bỏ hẳn, log lại để dev check).

```