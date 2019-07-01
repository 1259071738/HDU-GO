window.onload = () => {
  const form = document.querySelector('form');
  document.querySelector('.formbox').innerHTML = '';
  // 禁止选择后跳转
  const serchCon = document.querySelector('p.search_con');
  serchCon.innerHTML = serchCon.innerHTML.replace(/onchange=".*?"/g, '');
  // 添加查询按钮
  const input = document.createElement('input');
  input.type = 'button';
  input.className = 'button';
  input.value = '添加选课信息';
  input.onclick = () => {
    fetchTable(form, (table) => {
      document.querySelector('.formbox').appendChild(table);
    });
  }
  serchCon.appendChild(input);
  const style = document.createElement('style');
  style.textContent = 'td:nth-last-child(-n+6) { display: none; }';
  document.head.appendChild(style);
}

function fetchTable(form, callback) {
  const formData = new FormData(form);
  fetch(location.toString(), {
    method: "POST",
    body: formData
  }).then(res => res.blob()).then(blob => {
    const reader = new FileReader();
    reader.readAsText(blob, 'gb2312');
    reader.onload = () => {
      const text = reader.result;
      const newDom = new DOMParser();
      const newDocument = newDom.parseFromString(text, 'text/html');
      const newTable = newDocument.querySelector('#DBGrid');
      callback(newTable);
    }
  });
}