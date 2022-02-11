//Total Content Constants
const bookContent = document.querySelector('.bookContent');
const codeContent = document.querySelector('.codeContent');
//Content List Constants
const contentList = document.querySelector('#contentList');
const codeContentList = document.querySelector('#codeContentList');
//Button Constants
const codeBtn = document.querySelector('#codeBtn');
const bookBtn = document.querySelector('#bookBtn');
//Form Constants
const form = document.querySelector('#addContentForm');
const anotherForm = document.querySelector('#addContentFormTwo');
//Database Refrence Constants
const bookDb = db.collection('books');
const codeDb = db.collection('code');


//On Click Functions
bookBtn.addEventListener('click', (e) =>{
  e.preventDefault();
  bookContent.style.display = 'block';
  codeContent.style.display = 'none'
})
codeBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  codeContent.style.display = 'block';
  bookContent.style.display = 'none';
})
//create element and render book content
function renderContent(doc){
  let li = document.createElement('li');
  let name = document.createElement('span');
  let type= document.createElement('span');
//  let cost = document.createElement('span');
  let cross = document.createElement('div');
  cross.innerHTML = '&times;';

    li.setAttribute('data-id', doc.id);
     li.classList.add('contentInput');
    name.textContent = doc.data().name;
      name.classList.add('nameInput');
    type.textContent = doc.data().type;
    //cost.textContent = doc.data().cost;

   var closeChild = li.appendChild(cross);
   closeChild.classList.add('closingButton');
    li.appendChild(name);
    li.appendChild(type);
    //li.appendChild(cost);
    contentList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute('data-id');
      db.collection('books').doc(id).delete();
    })

}

//Create element and render code content
function renderCodeContent(doc){
  let li = document.createElement('li');
  let func = document.createElement('span');
  let focus= document.createElement('span');
//  let styled = document.createElement('span');
  let cross = document.createElement('div');
  cross.innerHTML = '&times;';

    li.setAttribute('data-id', doc.id);
     li.classList.add('contentInput');
    func.textContent = doc.data().function;
      func.classList.add('nameInput');
    focus.textContent = doc.data().focus;
  //   if(doc.data().styled === true){
  //     styled.textContent = 'Styled: Yes'
  //   } else {
  //     styled.textContent = 'Base Model'
  //   }
   var closeChild = li.appendChild(cross);
   closeChild.classList.add('closingButton');
    li.appendChild(func);
    li.appendChild(focus);
    //li.appendChild(styled);
    codeContentList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute('data-id');
      db.collection('code').doc(id).delete();
    })

}
//Getting Data
//db.collection('books').orderBy('name').get().then((snapshot) =>{
//    snapshot.docs.forEach(doc => {
//      console.log(doc.data());
//      renderContent(doc);
//    })
//})
//RealTimeListener for books
db.collection('books').orderBy('name').onSnapshot(snapshot => {
//onSnapshot() is a method for listening to the firebase- allows real-time updates
  let changes = snapshot.docChanges();
  //docChanges() are changes to the doc(database)
  console.log(changes);
  changes.forEach(change =>{
  console.log(change.doc.data());
    if(change.type == 'added'){
      renderContent(change.doc);
    } else if(change.type == 'removed'){
      let li = contentList.querySelector('[data-id=' + change.doc.id + ']');
      contentList.removeChild(li);
    }
  })
})
//Real-Time Listener for code
db.collection('code').orderBy('function').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
  console.log(change.doc.data());
  if(change.type == 'added'){
    renderCodeContent(change.doc);
  }  else if(change.type == 'removed'){
      let li = codeContentList.querySelector('[data-id=' + change.doc.id + ']');
      codeContentList.removeChild(li);
  }
  })
})

//Saving data for books
form.addEventListener('submit', (e)=> {
  e.preventDefault();
  db.collection('books').add({
    name: form.name.value,
    type: form.type.value

  });
  form.name.value = '';
  form.type.value = '';
})
//Saving data for Code
anotherForm.addEventListener('submit', (e) =>{
  e.preventDefault();
  db.collection('code').add({
    function: anotherForm.function.value,
    focus: anotherForm.focus.value
  });
  anotherForm.function.value = '';
  anotherForm.focus.value = '';
})
//Click to show pop-up of cost
