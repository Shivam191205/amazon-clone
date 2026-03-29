'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.login_container}>
      <Link href="/">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
          alt="Amazon Logo" 
          className={styles.logo}
        />
      </Link>

      <div className={styles.login_box}>
        <h1>Sign in</h1>
        
        {error && <div className={styles.error_message}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="email">Email or mobile phone number</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className={styles.signin_btn} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className={styles.legal}>
          By continuing, you agree to Amazon's Clone <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
        </p>
      </div>

      <div className={styles.divider}>
        <h5>New to Amazon?</h5>
      </div>

      <Link href="/signup" className={styles.signup_btn_link}>
        Create your Amazon account
      </Link>

      <footer className={styles.login_footer}>
        <div className={styles.footer_links}>
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
        </div>
        <p>&copy; 1996-2024, Amazon-Clone.com, Inc. or its affiliates</p>
      </footer>
    </div>
  );
}
