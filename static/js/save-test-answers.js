function form_to_json(form) {
    return Array.from(form.querySelectorAll("input, select, textarea"))
                          .filter(element => element.name)
                          .reduce((json, element) => {
                                json[element.name] = element.type === "checkbox" ? element.checked : element.value;
                                return json;
                          }, {});
}

function form_to_json_str(form) {
    let json = form_to_json(form);
    return encodeURIComponent(JSON.stringify(json));
}

function json_to_form(form, json) {
    Object.entries(json)
          .forEach(([name, value]) => {
                let element = form[name];
                if (element != undefined)
                {
                    if (element.type === "checkbox") { element.checked = value; }
                    else                             { element.value = value; }
                }
          });
}

function json_str_to_form(form, str) {
    try {
        let json = JSON.parse(decodeURIComponent(str));
        json_to_form(form, json);
    } catch (e) {
    }
}

// ------------------------------------------------------------ //

function get_data_name(form)
{
    return "test-" + form.dataset.chapter; 
}

// ------------------------------------------------------------ //

function storage_or_cookie(fcn_storage, fcn_cookie) {
    // If the browser supports local storage, use it.
    // Otherwise, use cookies as backup solution (they have a more limited capacity than local storage).
    if (typeof(Storage) !== "undefined") {
        return fcn_storage;
    }
    else {
        return fcn_cookie;
    }
}

// ------------------------------------------------------------ //

function save_form_storage(form) {
    let json = form_to_json_str(form);
    localStorage.setItem(get_data_name(form), json);
};

function save_form_cookie(form) {
    let next_month = new Date();
    next_month.setMonth(next_month.getMonth() + 1);

    document.cookie = "test_answers=" + form_to_json_str(form) + "; expires=" + next_month.toUTCString() + ";";
};

function save_form(form) {
    let save_fcn = storage_or_cookie(save_form_storage, save_form_cookie);
    save_fcn(form);
};

// ------------------------------------------------------------ //


function load_form_storage(form) {
    let json = localStorage.getItem(get_data_name(form));
    if (json)
    {
        json_str_to_form(form, json);
    }
};

function load_form_cookie(form) {
    let regex = new RegExp("test_answers=([^;]+)");
    let cookies = regex.exec(document.cookie);

    if (cookies != undefined && cookies[1] != undefined)
    {
        json_str_to_form(form, cookies[1]);
    }
};

function load_form(form) {
    let load_fcn = storage_or_cookie(load_form_storage, load_form_cookie);
    load_fcn(form);
};

// ------------------------------------------------------------ //

var form = document.getElementById("test");
if (form != undefined)
{
    load_form(form);
    form.addEventListener("change", function() { save_form(form); });
}
