const express = require('express');
const https = require('https');
const app = express();

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
