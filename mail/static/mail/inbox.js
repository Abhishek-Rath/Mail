document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.getElementById('compose-form').addEventListener('submit', send_mail)
  // const btn = document.querySelector('.btn');
  // btn.addEventListener('click', send_mail)

  // By default, load the inbox
  load_mailbox('inbox');
});

// Function to compose email
function compose_email() { 

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}


// Function to load mailbox 
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  const email_view = document.querySelector('#emails-view');
  email_view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
      emails.forEach(email => {
        let div = document.createElement('div');
        div.className = email['read'] ? 'email-read' : 'email-unread';
        div.innerHTML = 
        `<span class="sender col-3">${email['sender']}</span>
        <span class="subject col-6">${email['subject']}</span>
        <span class="timestamp col-3"> ${email['timestamp']} </span>
        `;
        email_view.appendChild(div);
      });
    })

}


// Function to send email
function send_mail(event) {

  // prevents default event to occur
  event.preventDefault();

  const recipients = document.getElementById('compose-recipients').value;
  const subject = document.getElementById('compose-subject').value;
  const body = document.getElementById('compose-body').value;

  fetch('/emails', {
    method: 'POST', 
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => load_mailbox('sent'));
};