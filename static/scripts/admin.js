document.getElementById('save-button').addEventListener("click", (e) => {
    e.preventDefault();
    let http = new XMLHttpRequest();
    let data = new FormData(document.getElementById('gallery-form'));
    http.open("POST", "/admin/upload", true);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('edit-form').submit();
        }
    };
    http.send(data);
});

document.getElementById('add-repertoire-button').addEventListener("click", (e) => {
    e.preventDefault();
    let newId = document.querySelectorAll('.repertoire-card').length;
    let repertoireAccordion = document.getElementById("accordionExample");
    let newNode = document.createElement("div");
    newNode.innerHTML = `<div class="card repertoire-card" num="${newId}">
                    <a class="delete-repertoire-button" href=""><img src="/img/ui/delete-icon.png"
                            alt="delete repertoire"></a>
                    <div id="heading${newId}" class="card-header border-0">

                        <h6 class="mb-0 font-weight-bold"><a href="#" data-toggle="collapse"
                                data-target="#collapse${newId}" aria-expanded="false"
                                aria-controls="collapseOne"
                                class="pr-5 d-block position-relative collapsed collapsible-link py-2"><textarea
                                    name="repertoire[${newId}][name]" rows="1">Название списка</textarea></a>
                        </h6>
                    </div>
                    <div id="collapse${newId}" aria-labelledby="heading${newId}"
                        data-parent="#accordionExample" class="collapse">
                        <div class="card-body">
                            <textarea name="repertoire[${newId}][data]" rows="10">Репертуарный список</textarea>
                            <input type="hidden" name="repertoire[${newId}][id]" value="${newId}"/>
                        </div>
                    </div>
                </div>`;
    let deleteButton = newNode.querySelector(".delete-repertoire-button");
    addDeleteParentEvent(deleteButton);
    repertoireAccordion.appendChild(newNode);
});

document.getElementById('add-phone-button').addEventListener("click", (e) => {
    e.preventDefault();
    let newId = document.querySelectorAll('.contact-phone').length;
    let phones = document.getElementById("phones");
    let newNode = document.createElement("div");
    newNode.innerHTML = `<div num="${newId}" class="contact-phone">\
            <input type="hidden" name="contacts_phones[${newId}][id]" value="${newId}">\
            <textarea name="contacts_phones[${newId}][name]" rows="1">Имя</textarea>\
            <textarea name="contacts_phones[${newId}][phone]" rows="1">Телефон</textarea>\
            <a class="delete-contact-button" href=""><img src="/img/ui/delete-icon.png" alt="delete contact"></a>\
        </div>`;
    let deleteButton = newNode.querySelector(".delete-contact-button");
    addDeleteParentEvent(deleteButton);
    phones.appendChild(newNode);
});

function addDeleteParentEvent(element) {
    element.addEventListener("click", (e) => {
        e.preventDefault();
        element.parentElement.remove();
    })
};
document.querySelectorAll('.delete-repertoire-button').forEach((element) => {
    addDeleteParentEvent(element);
});

document.querySelectorAll('.delete-photo-button').forEach((element) => {
    element.addEventListener("click", () => {
        let toDelete = document.createElement("div");
        toDelete.innerHTML = `<input type="hidden" name="photosToDelete[]" value="${element.getAttribute("link")}">`;
        document.getElementById('photo').appendChild(toDelete);
        element.parentElement.remove();
    })
});

document.querySelectorAll('.delete-contact-button').forEach((element) => {
    element.addEventListener("click", (e) => {
        e.preventDefault();
        element.parentElement.remove();
    })
});

document.querySelectorAll(".video-item").forEach((element) => {
    let iframe = element.querySelector(".responsive-iframe");
    let textarea = element.querySelector("textarea");
    let inputVideoId = element.querySelector(".videoId-input");
    textarea.addEventListener('input', () => {
        let youtubeId = GetYoutubeId(textarea.value);
        iframe.setAttribute("src", `https://www.youtube.com/embed/${youtubeId}`);
        inputVideoId.setAttribute("value", youtubeId);
    });
});

function GetYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
        ? match[2]
        : null;
}

tinymce.init({
  selector: 'textarea.editor',
  plugins: 'paste importcss searchreplace autolink save visualblocks visualchars image link media template table charmap hr pagebreak nonbreaking toc insertdatetime advlist lists imagetools textpattern noneditable charmap quickbars emoticons',
  imagetools_cors_hosts: ['picsum.photos'],
  menubar: 'edit view insert format tools table',
  toolbar: 'undo redo | bold italic underline strikethrough | image media link | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons ',
  toolbar_sticky: true,
  image_advtab: true,
  link_list: [
    { title: 'My page 1', value: 'http://www.tinymce.com' },
    { title: 'My page 2', value: 'http://www.moxiecode.com' }
  ],
  image_list: [
    { title: 'My page 1', value: 'http://www.tinymce.com' },
    { title: 'My page 2', value: 'http://www.moxiecode.com' }
  ],
  image_class_list: [
    { title: 'None', value: '' },
    { title: 'Some class', value: 'class-name' }
  ],
  importcss_append: true,
  file_picker_callback: function (callback, _value, meta) {
    /* Provide file and text for the link dialog */
    if (meta.filetype === 'file') {
      callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
    }

    /* Provide image and alt text for the image dialog */
    if (meta.filetype === 'image') {
      callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
    }

    /* Provide alternative source and posted for the media dialog */
    if (meta.filetype === 'media') {
      callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
    }
  },
  templates: [
        { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
    { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
    { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
  ],
  template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
  template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
  height: 600,
  image_caption: true,
  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  noneditable_noneditable_class: 'mceNonEditable',
  toolbar_mode: 'sliding',
  contextmenu: 'link image imagetools table',
  content_style: ' body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }'
 });
