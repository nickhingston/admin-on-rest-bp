export default {
    mothership_admin: {
        action: {
            delete: 'Delete',
            show: 'Show',
            list: 'List',
            save: 'Save',
            create: 'Create',
            edit: 'Edit',
            cancel: 'Cancel',
            refresh: 'Refresh',
            add_filter: 'Add filter',
            remove_filter: 'Remove this filter',
        },
        boolean: {
            true: 'Yes',
            false: 'No',
        },
        page: {
            list: '%{name} List',
            edit: '%{name} #%{id}',
            show: '%{name} #%{id}',
            create: 'Create %{name}',
            delete: 'Delete %{name} #%{id}',
            dashboard: 'Dashboard',
        },
        input: {
            file: {
                upload_several: 'Drop some files to upload, or click to select one.',
                upload_single: 'Drop a file to upload, or click to select it.',
            },
            image: {
                upload_several: 'Drop some pictures to upload, or click to select one.',
                upload_single: 'Drop a picture to upload, or click to select it.',
            },
        },
        message: {
            yes: 'Yes',
            no: 'No',
            are_you_sure: 'Are you sure ?',
            about: 'About',
        },
        navigation: {
            no_results: 'No results found',
            page_out_of_boundaries: 'Page number %{page} out of boundaries',
            page_out_from_end: 'Cannot go after last page',
            page_out_from_begin: 'Cannot go before page 1',
            page_range_info: '%{offsetBegin}-%{offsetEnd} of %{total}',
            next: 'Next',
            prev: 'Prev',
        },
        auth: {
            username: 'Username',
            password: 'Password',
			sign_in: 'Sign in',
			sign_up: 'Sign up',
            sign_in_error: 'Authentication failed, please retry',
			logout: 'Logout',
            register: 'Register',
            forgot_password: 'Forgot Password?'
        },
        notification: {
            updated: 'Element updated',
            created: 'Element created',
            deleted: 'Element deleted',
            item_doesnt_exist: 'Element does not exist',
            http_error: 'Server communication error',
        },
        validation: {
            required: 'Required',
            minLength: 'Must be %{min} characters at least',
            maxLength: 'Must be %{max} characters or less',
            minValue: 'Must be at least %{min}',
            maxValue: 'Must be %{max} or less',
            number: 'Must be a number',
            email: 'Must be a valid email',
        },
        register: {
            request_sent: 'Registation requested, please check your email',
            already_registered: 'This email already has an account...',
            request_failed: 'Request failed, please try again later...',
            expired: 'Registration expired, please re-request sign up',
            create_user: 'Create user'
        },
        subscription: {
            succeeded: 'Subscription success',
            delete_succeeded: 'Subscription canceled',
            failed: 'Subscription failure, please check payment details',
            delete_failed: 'Subscription cancel failure'
        },
        password: {
            request_sent:   'Password request sent, please check your inbox',
            request_failed: 'Password request failed, please try again later',
            get_request_failed_404: 'Could not find password reset, request has expired or token already used',
            update_succeeded: 'Your password has changed, please login',
            passwords_must_match: 'Passwords must match'
        }
    },
};
