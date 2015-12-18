function DugunNotifications(toaster) {
    var service = {};

    service.error = function(http) {
        if(http.status === 500) {
            return serverError();
        } else if(http.status === 422) {
            return validationErrors(http.data);
        } else if(http.status === 403) {
            return forbiddenError();
        } else if(http.status === 404) {
            return notFoundError();
        } else if(http.status === 405) {
            return forbiddenError();
        }
    };

    service.success = function(text, header) {
        return showAlert('success', header || 'Başarılı', text || '');
    };

    function serverError() {
        return showAlert('error', 'Sunucuda bir hata oluştu');
    }

    function validationErrors(data) {
        for(var i in data.errors) {
            showAlert('error', data.errors[i].message, data.errors[i].path);
        }
        return;
    }

    function forbiddenError() {
        return showAlert('error', 'Bu işlem için yetkiniz yok', 'Hata');
    }

    function notFoundError() {
        return showAlert('error', 'Böyle bir kayıt bulunamadı', 'Hata');
    }

    function showAlert(type, text, header) {
        return toaster.pop(type, header || 'Hata', text);
    }

    return service;
}

DugunNotifications.$inject = [
    'toaster',
];

angular.module('dugun.notifications')
    .factory('dgNotifications', DugunNotifications);