angular.module('dugun.notifications').constant('dgNotificationsConfig', {
    translations: {
        'ERROR': 'Error',
        'SUCCESS': 'Success',
        'HTTP_500': 'Server error',
        'HTTP_403': 'You do not have permission to do this',
        'HTTP_404': 'Not found'
    }
});

angular.module('dugun.notifications', [
    'toaster'
]);

function DugunNotifications(toaster, dgNotificationsConfig) {
    var service = {};

    service.error = function (http) {
        if (typeof http === 'string') {
            return customError(http);
        } else if (http.status === 500) {
            return serverError();
        } else if (http.status === 422) {
            return validationErrors(http.data);
        } else if (http.status === 403) {
            return forbiddenError();
        } else if (http.status === 404) {
            return notFoundError();
        } else if (http.status === 405) {
            return forbiddenError();
        }
    };

    service.success = function (text, header) {
        return showAlert('success', header || dgNotificationsConfig.translations.SUCCESS, text || '');
    };

    function serverError() {
        return showAlert('error', dgNotificationsConfig.translations.HTTP_500);
    }

    function validationErrors(data) {
        if (data.message && data.errors.length === 0) {
            showAlert('error', data.message);
            return;
        }
        if (data.errors) {
            for (var i in data.errors) {
                showAlert('error', data.errors[i].message, data.errors[i].path);
            }
        }
        if (data) {
            /** this is for laravel5.x validation response. i is name of field. */
            for (var i in data) {
                for (var j in data[i]) {
                    showAlert('error', data[i][j], i);
                }
            }
        }

        return;
    }

    function forbiddenError() {
        return showAlert('error', dgNotificationsConfig.translations.HTTP_403, dgNotificationsConfig.translations.ERROR);
    }

    function notFoundError() {
        return showAlert('error', dgNotificationsConfig.translations.HTTP_404, dgNotificationsConfig.translations.ERROR);
    }

    function customError(message) {
        return showAlert('error', message);
    }

    function showAlert(type, text, header) {
        return toaster.pop(type, header || dgNotificationsConfig.translations.ERROR, text);
    }

    return service;
}

DugunNotifications.$inject = [
    'toaster',
    'dgNotificationsConfig',
];

angular.module('dugun.notifications')
    .factory('dgNotifications', DugunNotifications);
