const inputs = document.querySelectorAll('input');

for(let i=0;i<inputs.length;i++) {
    inputs[i].setAttribute('autocomplete',"off");
}


const myLibrary = [];

function Book(title,author,pages,read,notes) {
    this.title = title;
    this.author = author;
    this.pages=pages;
    this.read=read;
    this.notes = notes;
}

function addBookToLibrary(title,author,pages,read,notes) {
    let book = new Book(title,author,pages,read,notes);
    myLibrary.push(book);
}

function display() {
    const library = document.querySelector('.container');
    for(let i=0;i<myLibrary.length; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        
        let title = document.createElement('p');
        title.classList.add('card-header');
        title.innerHTML = "<span class='book-title'>" +  myLibrary[i].title + "</span>";
        card.appendChild(title);

        let author = document.createElement('p');
        author.classList.add('card-header');
        author.innerHTML = 'by ' + '<span class="book-author">'+ myLibrary[i].author + '</span>';
        card.appendChild(author);

        let pages = document.createElement('p'); 
        pages.classList.add('card-body');
        pages.innerText = 'Pages: ' + myLibrary[i].pages;       
        card.appendChild(pages);

        let read = document.createElement('button'); 
        read.classList.add('read-bool');
        read.style.boxShadow = '2px 1px 2px lightgray';
        if(myLibrary[i].read == true){
            read.innerText = 'Completed';
            read.style.backgroundColor = 'lightgreen';
        }
        else {
            read.innerText ='Not Completed';
            read.style.backgroundColor = 'lightcoral';
        }
        read.addEventListener('click', () => {
            let node = read.parentNode.childNodes;
            let target = getIndex(node);
            //console.log(myLibrary[target]);
            myLibrary[target].read = !myLibrary[target].read;
            if(myLibrary[i].read == true) {
                read.innerText = 'Completed';
                read.style.backgroundColor = 'lightgreen';
            }
            else {
                read.innerText ='Not Completed';
                read.style.backgroundColor = 'lightcoral';
            }
        })
        card.appendChild(read);


        let notes = document.createElement('p'); 
        notes.classList.add('card-body');
        notes.classList.add('card-notes');
        notes.innerText = myLibrary[i].notes;       
        card.appendChild(notes);

        let del_div = document.createElement('div');
        del_div.classList.add('del-div');

        let del_btn = document.createElement('button');
        del_btn.id = 'del-btn';
        del_btn.style.boxShadow = '2px 1px 2px gray';
        del_btn.innerText = 'Remove Book';
        del_btn.addEventListener('click', () => {
            let ancestor = del_btn.parentNode.parentNode.parentNode;
            let parent = del_btn.parentNode.parentNode.childNodes;
            let index = getCardIndex(ancestor,parent);
            let list = document.querySelectorAll('.card');

            ancestor.removeChild(list[index]);
            myLibrary.splice(getIndex(parent),1);
        })

        del_div.appendChild(del_btn);

        card.appendChild(del_div);
        library.appendChild(card);
    }
}
function clear() {
    const library = document.querySelector('.container');
    if(library.hasChildNodes())
    {
        let del = document.querySelectorAll('.container > .card');
        for(let i=0;i<del.length;i++) {
            library.removeChild(del[i]);
        }
    }
}

addBookToLibrary('hunger games','jk rowling',123,true,'cool');
addBookToLibrary('harry potter','james patterson',999,false,'magical');
addBookToLibrary('harry potter2','james patterson II',10000,false,'crazy');


display();

const dialog = document.querySelector('.modal');
dialog.addEventListener('click',()=> dialog.close());
const newbook = document.querySelector('.new-book');
newbook.addEventListener('click', () => {
    dialog.showModal();
})

const modal = document.querySelector('.modal-form');
modal.addEventListener('click',(event)=>event.stopPropagation());


const submit = document.querySelector('#library-form');
submit.addEventListener('submit', (event) => {
    if(!submit.checkValidity()){
        return;
    }
    else {
        event.preventDefault();
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const pages = document.querySelector('#pages').value;
        const read = document.querySelector('#read').checked;
        const notes = document.querySelector('#notes').value;
        console.log(read);
        addBookToLibrary(title,author,pages,read,notes);
        dialog.close();
        clear();
        display();
        submit.reset();
        
        console.log(myLibrary);
    }        
});

function getCardIndex(ancestor,parent) {
    let cards = ancestor.childNodes;
    for(let i=1;i<cards.length;i++) {
        if(cards[i].childNodes == parent) {
            return i-1;
        }
    }
    return;
}

function getIndex(nodes) {
    let check = false;
    if(nodes[3].innerText == 'Completed') check = true;
    else check = false;
    for(let i=0;i<myLibrary.length;i++) {
        if(myLibrary[i].title == nodes[0].innerText && 
        myLibrary[i].author == nodes[1].innerText.slice(3) &&
        myLibrary[i].pages == nodes[2].innerText.slice(7) && 
        myLibrary[i].read == check && 
        (myLibrary[i].notes == nodes[4].innerText)) {
            return i;
        }
        else return;
    }
}
