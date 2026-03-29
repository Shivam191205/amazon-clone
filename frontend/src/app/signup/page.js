'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from '../login/login.module.css';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup({ name, email, password });
      router.push('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
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
        <h1>Create account</h1>
        
        {error && <div className={styles.error_message}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="name">Your name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="First and last name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="email">Mobile number or email</label>
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
              placeholder="At least 6 characters"
              value={password} 
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
            />
          </div>

          <button type="submit" className={styles.signin_btn} disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create your Amazon account'}
          </button>
        </form>

        <p className={styles.legal}>
          By creating an account, you agree to Amazon's Clone <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
        </p>

        <div className={styles.divider} style={{ margin: '20px 0 10px 0' }}></div>

        <p style={{ fontSize: '13px' }}>
          Already have an account? <Link href="/login" style={{ color: '#0066c0', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>

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
