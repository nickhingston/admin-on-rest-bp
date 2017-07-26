import React from 'react';
import { Route } from 'react-router-dom';
import register from './register';

export default [
    <Route path="/register/:id" render={register} />
];