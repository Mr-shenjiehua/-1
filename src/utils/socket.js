/*
 * @Des: 
 * @Author: jin_yc
 * @Date: 2020-01-02 09:16:50
 * @LastEditor: jin_yc
 * @LastEditTime : 2020-01-07 20:38:08
 */
import storage from '@/utils/storage'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import store from '@/store'
import { Notification } from 'fawkes-lib'

var stompClient

//sockJs初始
export default function initWebSocket() {
    connection()
    // 断开重连机制,尝试发送消息,捕获异常发生时重连
    // this.timer = setInterval(() => {
    //   try {
    //     that.stompClient.send('test')
    //   } catch (err) {
    //     console.log('断线了: ' + err)
    //     that.connection()
    //   }
    // }, 5000)
}
export function connection() {
    let accessToken = storage.get('access_token')
    if (!accessToken) return
    let url = '/socket/sys-socket'

    let socket = new SockJS(
        url + '/server?fawkes-auth=' + accessToken + '&onlineClientType=web'
    )
    // 获取STOMP子协议的客户端对象
    stompClient = Stomp.over(socket)
    // 定义客户端的认证信息,按需求配置
    let headers = {
        Authorization: ''
    }
    // 向服务器发起websocket连接
    stompClient.connect(
        headers,
        () => {
            //订阅 /user/topic/chat 发送的消息，这里与
            //在控制器的messagingTemplate.convertAndSendToUser中定义的订阅地址保持一致
            //这里多了 /user ，并且这个 /user是必须的，使用了 /user 才会将消息发送到指定用户
            stompClient.subscribe('/user/topic/message', (response) => {
                store.commit('RELOAD_MESSAGE', true)
                openNotify(response)
            })
        },
        (err) => {
            // 连接发生错误时的处理函数
            console.log('连接失败')
            console.log(err)
        }
    )
}
// 断开连接
export function disconnect() {
    if (stompClient) {
        stompClient.disconnect()
    }
}
//消息弹窗提示
export function openNotify(response) {
    Notification({
        title: '新消息提示',
        message: response.body,
        position: 'bottom-right',
        duration: 0
    })
    console.log(response)
}

    //   initWebSocket() {
    //     let accessToken = storage.get('access_token')
    //     //初始化weosocket
    //     const wsuri =
    //       'wss://apigateway.ecidi.com/fawkes-new/local/api/sys-socket/server?fawkes-auth=' +
    //       accessToken +
    //       '&onlineClientType=web'
    //     this.websock = new WebSocket(wsuri)
    //     this.websock.onmessage = this.websocketonmessage
    //     this.websock.onopen = this.websocketonopen
    //     this.websock.onerror = this.websocketonerror
    //     this.websock.onclose = this.websocketclose
    //   },
    //   websocketonopen() {
    //     //连接建立之后执行send方法发送数据
    //     let actions = { test: '12345' }
    //     this.websocketsend(JSON.stringify(actions))
    //   },
    //   websocketonerror() {
    //     //连接建立失败重连
    //     this.initWebSocket()
    //   },
    //   websocketonmessage(e) {
    //     //数据接收
    //     const redata = JSON.parse(e.data)
    //   },
    //   websocketsend(Data) {
    //     //数据发送
    //     this.websock.send(Data)
    //   },
    //   websocketclose(e) {
    //     //关闭
    //     console.log('断开连接', e)
    //   }
