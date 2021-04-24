const socket = io();

let connections_users = [];
let current_connections = [];

socket.on("admin_list_all_users", connections => {

    connections_users = connections; 
    console.log(connections);

    document.getElementById("list_users").innerHTML = "";

    let template = document.getElementById("template").innerHTML;

    connections.forEach( connection => {
        
        const rendered = Mustache.render(template, {
            id: connection.socket_id,
            email: connection.user.email,
        });

        document.getElementById("list_users").innerHTML += rendered;
    });
});

function call(id) {

    const connection = connections_users.find(
        connection => connection.socket_id === id
    );

    current_connections.push(connection);

    const template = document.getElementById("admin_template").innerHTML;

    const rendered = Mustache.render(template, {
        email: connection.user.email,
        id: connection.user_id,
    });

    document.getElementById("supports").innerHTML += rendered;

    const params = { user_id: connection.user_id };

    socket.emit("admin_user_in_support", params);

    socket.emit("admin_list_messages_by_user", params, messages => {
        
        console.log(messages);

        const divMessages = document.getElementById(`allMessages${connection.user_id}`);

        messages.forEach(message => {
            const createDiv = document.createElement("div");

            if(message.admin_id === null) {

                createDiv.className = "admin_message_client";

                createDiv.innerHTML = `<span>${connection.user.email}</span>`;
                createDiv.innerHTML += `<span>${message.text}</span>`
                createDiv.innerHTML += `<span class="admin_date">${dayjs(
                    message.created_at
                ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
                console.log(createDiv.innerHTML);

            } else {

                createDiv.className = "admin_message_admin";

                createDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
                createDiv.innerHtml += `<span class="admin_date">${dayjs(
                    message.created_at
                ).format("DD/MM/YYYY HH:mm:ss")}</span>`;

            }

            divMessages.appendChild(createDiv);
        });

    });
}

function sendMessage(id) {
    
    const text = document.getElementById(`send_message_${id}`);

    const params = {
        text: text.value,
        user_id: id,
    };

    socket.emit("admin_send_message", params);

    const divMessages = document.getElementById(`allMessages${id}`);
    const createDiv = document.createElement("div");

    createDiv.className = "admin_message_admin";

    createDiv.innerHTML = `Atendente: <span>${params.text}</span>`;
    createDiv.innerHtml += `<span class="admin_date">${dayjs().format("DD/MM/YYYY HH:mm:ss")}</span>`;

    divMessages.appendChild(createDiv);

    text.value = "";
}
 
socket.on("admin_receive_message", data => {

    console.log(data);
    const { message, socket_id } = data;

    const connection = current_connections.find(
        connection => connection.socket_id === socket_id
    );

    const divMessages = document.getElementById(`allMessages${connection.user_id}`);
    const createDiv = document.createElement("div");

    createDiv.className = "admin_message_client";

    createDiv.innerHTML = `<span>${connection.user.email}</span>`;
    createDiv.innerHTML += `<span>${message.text}</span>`
    createDiv.innerHTML += `<span class="admin_date">${dayjs(
        message.created_at
    ).format("DD/MM/YYYY HH:mm:ss")}</span>`;

    divMessages.appendChild(createDiv);

 });