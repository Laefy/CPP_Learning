function form_to_json_str(form) {
    let json = Array.from(form.querySelectorAll("input, select, textarea"))
                    .filter(element => element.name)
                    .reduce((json, element) => {
                        json[element.name] = element.type === "checkbox" ? element.checked : element.value;
                        return json;
                    }, {});

    return JSON.stringify(json);
}

function save_form(form) {
    let next_month = new Date();
    next_month.setMonth(next_month.getMonth() + 1);

    document.cookie = "test_answers=" + encodeURIComponent(form_to_json_str(form)) + "; expires=" + next_month.toUTCString() + ";";
};

function load_form(form) {
    let regex = new RegExp("test_answers=([^;]+)");
    let cookies = regex.exec(document.cookie);

    if (cookies != undefined && cookies[1] != undefined)
    {
        let json = JSON.parse(decodeURIComponent(cookies[1]));
        Object.entries(json)
              .forEach(([name, value]) => {
                    let element = form[name];
                    if (element !== undefined)
                    {
                        if (element.type === "checkbox") { element.checked = value; }
                        else                             { element.value = value; }
                    }
              });
    }
};

var form = document.getElementById("test");
if (form != undefined)
{
    load_form(form);
    form.addEventListener("change", function() { save_form(form); });
}
