const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*'
}));

const server = app.listen(3001, () => {
    console.log('Server Started!')
})

app.get('/api/users/:date', async (req, res) => {
    var {date} = req.params;
    let res1 = '';

    https.get(`https://www.gojls.com/branch/myservice/homework/note/1579774/${date}`, response => {
        let result = '';
      
        response.on('data', chunk => {
          result += chunk;
        });
      
        response.on('end', () => {
            if (String(result) == '{"data":"[]","header":{"isSuccessful":true,"resultCode":0,"resultMessage":"success"}}') {
                res.send('업로드 되지 않았거나 잘못된 날짜입니다.');
            }
            else {
                console.log(result)
                let data1 = String(result)
                data1 = data1 = data1.replaceAll('\\n', '(CL)');
                const data = data1.replace(/\\/g, '');
                console.log(data)

                let result1 = data.slice(0, 8); // .slice를 이용하여 " 삭제
                let result2 = result1+data.slice(9,20)// .slice를 이용하여 " 삭제
                let result3 = result2+data.slice(21, data.length-80)
                let result4 = result3+'}]}}]'+data.slice(data.length-73)
                const parsedJson = JSON.parse(result4);
                console.log(parsedJson)
                const insertValues2 = parsedJson.data.map(notice => notice.notice.ops.map(op => op.insert)).flat();

                for (let i = 0; i < insertValues2.length; i++) {
                    insertValues2[i] = insertValues2[i].replace(/\(CL\)/g, '<br>')
                }

                for (let i = 0; i < insertValues2.length; i++) {
                    if (insertValues2[i].includes(''))
                    res1 = res1 + insertValues2[i];
                }

                console.log(res1)
                res.send(res1);
            }
        });
      }).on('error', error => {
        console.error(error);
      });
});

app.get('/api/today', async (req, res) => {
    const datenow = new Date();
    const yearnow = datenow.getFullYear().toString();
    const monthnow = (datenow.getMonth() + 1).toString().padStart(2, '0');
    const daynow = datenow.getDate().toString().padStart(2, '0');
    const yyyymmddnow = yearnow + monthnow + daynow;

    let res1 = '';

    https.get(`https://www.gojls.com/branch/myservice/homework/note/1579774/${yyyymmddnow}`, response => {
        let result = '';
      
        response.on('data', chunk => {
          result += chunk;
        });
      
        response.on('end', () => {
            if (String(result) == '{"data":"[]","header":{"isSuccessful":true,"resultCode":0,"resultMessage":"success"}}') {
                let todayT = new Date(); // 현재 날짜와 시간을 나타내는 Date 객체 생성
                let tomorrowT = new Date(todayT.getTime() + 24 * 60 * 60 * 1000); // 현재 날짜와 1일(24시간)을 더하여 새로운 Date 객체 생성
                let yyyyT = tomorrowT.getFullYear();
                let mmT = String(tomorrowT.getMonth() + 1).padStart(2, '0');
                let ddT = String(tomorrowT.getDate()).padStart(2, '0');
                let yyyymmddtomo = yyyyT + mmT + ddT;
                https.get(`https://www.gojls.com/branch/myservice/homework/note/1579774/${yyyymmddtomo}`, response => {
                    let resultT = ''
                    response.on('data', chunk => {
                        resultT += chunk;
                    });
                
                    response.on('end', () => {
                        if (String(resultT) == '{"data":"[]","header":{"isSuccessful":true,"resultCode":0,"resultMessage":"success"}}') {
                            let todayTT = new Date(); // 현재 날짜와 시간을 나타내는 Date 객체 생성
                            let twoDaysLaterTT = new Date(todayTT.getTime() + 2 * 24 * 60 * 60 * 1000); // 현재 날짜와 2일(48시간)을 더하여 새로운 Date 객체 생성
                            let yyyyTT = twoDaysLaterTT.getFullYear();
                            let mmTT = String(twoDaysLaterTT.getMonth() + 1).padStart(2, '0');
                            let ddTT = String(twoDaysLaterTT.getDate()).padStart(2, '0');
                            let yyyymmddTwoDaysLater = yyyyTT + mmTT + ddTT;
                            https.get(`https://www.gojls.com/branch/myservice/homework/note/1579774/${yyyymmddTwoDaysLater}`, response => {
                                let resultTT = ''
                                response.on('data', chunk => {
                                    resultTT += chunk;
                                });

                                response.on('end', () => {
                                    console.log(resultTT)
                                    let data1 = String(resultTT)
                                    data1 = data1 = data1.replaceAll('\\n', '(CL)');
                                    const data = data1.replace(/\\/g, '');
                                    console.log(data)
                    
                                    let result1 = data.slice(0, 8); // .slice를 이용하여 " 삭제
                                    let result2 = result1+data.slice(9,20)// .slice를 이용하여 " 삭제
                                    let result3 = result2+data.slice(21, data.length-80)
                                    let result4 = result3+'}]}}]'+data.slice(data.length-73)
                                    const parsedJson = JSON.parse(result4);
                                    console.log(parsedJson)
                                    const insertValues2 = parsedJson.data.map(notice => notice.notice.ops.map(op => op.insert)).flat();
                    
                                    for (let i = 0; i < insertValues2.length; i++) {
                                        insertValues2[i] = insertValues2[i].replace(/\(CL\)/g, '<br>')
                                    }
                    
                                    for (let i = 0; i < insertValues2.length; i++) {
                                        if (insertValues2[i].includes(''))
                                        res1 = res1 + insertValues2[i];
                                    }
                    
                                    console.log(res1)
                                    res.send(`[ ${yyyymmddTwoDaysLater} ]<br>`+res1);
                                })
                            })
                        }
                        else {
                            console.log(resultT)
                            let data1 = String(resultT)
                            data1 = data1 = data1.replaceAll('\\n', '(CL)');
                            const data = data1.replace(/\\/g, '');
                            console.log(data)
            
                            let result1 = data.slice(0, 8); // .slice를 이용하여 " 삭제
                            let result2 = result1+data.slice(9,20)// .slice를 이용하여 " 삭제
                            let result3 = result2+data.slice(21, data.length-80)
                            let result4 = result3+'}]}}]'+data.slice(data.length-73)
                            const parsedJson = JSON.parse(result4);
                            console.log(parsedJson)
                            const insertValues2 = parsedJson.data.map(notice => notice.notice.ops.map(op => op.insert)).flat();
            
                            for (let i = 0; i < insertValues2.length; i++) {
                                insertValues2[i] = insertValues2[i].replace(/\(CL\)/g, '<br>')
                            }
            
                            for (let i = 0; i < insertValues2.length; i++) {
                                if (insertValues2[i].includes(''))
                                res1 = res1 + insertValues2[i];
                            }
            
                            console.log(res1)
                            res.send(`[ ${yyyymmddtomo} ]<br>`+res1);
                        }
                    })
            })
            }
            else {
                console.log(result)
                let data1 = String(result)
                data1 = data1 = data1.replaceAll('\\n', '(CL)');
                const data = data1.replace(/\\/g, '');
                console.log(data)

                let result1 = data.slice(0, 8); // .slice를 이용하여 " 삭제
                let result2 = result1+data.slice(9,20)// .slice를 이용하여 " 삭제
                let result3 = result2+data.slice(21, data.length-80)
                let result4 = result3+'}]}}]'+data.slice(data.length-73)
                const parsedJson = JSON.parse(result4);
                console.log(parsedJson)
                const insertValues2 = parsedJson.data.map(notice => notice.notice.ops.map(op => op.insert)).flat();

                for (let i = 0; i < insertValues2.length; i++) {
                    insertValues2[i] = insertValues2[i].replace(/\(CL\)/g, '<br>')
                }

                for (let i = 0; i < insertValues2.length; i++) {
                    if (insertValues2[i].includes(''))
                    res1 = res1 + insertValues2[i];
                }

                console.log(res1)
                res.send(`[ ${yyyymmddnow} ]<br>`+res1);
            }
        });
      }).on('error', error => {
        console.error(error);
      });
});
