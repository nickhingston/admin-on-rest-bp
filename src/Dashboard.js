import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

export default () => (
    <Card style={{ margin: '2em' }}>
        <CardHeader title="Welcome to vPOP Admin" />
        <CardContent>Please use this to manage your user profile, manage account and subscription</CardContent>
    </Card>
);
