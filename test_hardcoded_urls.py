#!/usr/bin/env python3
"""
Test script to verify all hardcoded URLs have been replaced with environment-based configuration
"""

import os
import re

def test_hardcoded_urls_removed():
    """Test that all hardcoded port 8000 URLs have been removed from React components"""
    print("🧪 Testing Hardcoded URLs Removed")
    print("=" * 50)
    
    # Directory to search
    react_dir = "/Users/wafflelover404/Documents/wikiai/wiki-ai-react"
    
    # Files to check
    files_to_check = [
        "components/cms-dashboard.tsx",
        "components/cms-content-manager.tsx", 
        "components/cms-login.tsx",
        "lib/api.ts",
        "lib/config.ts"
    ]
    
    hardcoded_patterns = [
        r"http://127\.0\.0\.1:8000",
        r"http://localhost:8000",
        r"https://api\.wikiai\.by",  # Should be in .env, not hardcoded
        r"8000"  # Port number should not be hardcoded
    ]
    
    issues_found = []
    
    print(f"\n🔍 Checking for hardcoded URLs in React components...")
    
    for file_path in files_to_check:
        full_path = os.path.join(react_dir, file_path)
        
        if not os.path.exists(full_path):
            print(f"  ⚠️ File not found: {file_path}")
            continue
            
        print(f"\n📁 Checking {file_path}:")
        
        try:
            with open(full_path, 'r') as f:
                content = f.read()
                
            for pattern in hardcoded_patterns:
                matches = re.findall(pattern, content)
                if matches:
                    issues_found.append(f"{file_path}: Found {len(matches)} matches for pattern '{pattern}'")
                    print(f"    ❌ Found {len(matches)} hardcoded URLs: {pattern}")
                else:
                    print(f"    ✅ No hardcoded URLs found for pattern '{pattern}'")
                    
        except Exception as e:
            print(f"    ❌ Error reading file: {e}")
    
    # Check if environment-based functions are being used
    print(f"\n🔍 Checking for environment-based function usage...")
    
    env_functions = [
        "getCmsEndpointUrl",
        "getApiUrl", 
        "getWsUrl",
        "API_CONFIG"
    ]
    
    for file_path in files_to_check:
        full_path = os.path.join(react_dir, file_path)
        
        if not os.path.exists(full_path):
            continue
            
        print(f"\n📁 Checking {file_path} for env functions:")
        
        try:
            with open(full_path, 'r') as f:
                content = f.read()
                
            for func in env_functions:
                if func in content:
                    print(f"    ✅ Using {func}")
                else:
                    print(f"    ⚠️ Not using {func}")
                    
        except Exception as e:
            print(f"    ❌ Error reading file: {e}")
    
    # Check .env configuration
    print(f"\n🔍 Checking .env configuration:")
    env_file = os.path.join(react_dir, ".env")
    
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            env_content = f.read()
            
        if "localhost:9001" in env_content:
            print(f"    ✅ .env configured for localhost:9001")
        elif "api.wikiai.by" in env_content:
            print(f"    ✅ .env configured for production")
        else:
            print(f"    ⚠️ .env configuration unclear")
            
        if "NEXT_PUBLIC_API_URL" in env_content:
            print(f"    ✅ NEXT_PUBLIC_API_URL configured")
        else:
            print(f"    ❌ NEXT_PUBLIC_API_URL not found")
    else:
        print(f"    ❌ .env file not found")
    
    # Summary
    print(f"\n📋 Test Summary:")
    if issues_found:
        print(f"    ❌ Issues found: {len(issues_found)}")
        for issue in issues_found:
            print(f"      - {issue}")
        return False
    else:
        print(f"    ✅ No hardcoded URLs found!")
        print(f"    ✅ Environment-based configuration in place!")
        return True

def show_next_steps():
    """Show next steps for testing"""
    print(f"\n🚀 Next Steps:")
    print(f"1. Restart React development server to pick up new .env configuration:")
    print(f"   cd /Users/wafflelover404/Documents/wikiai/wiki-ai-react")
    print(f"   npm run dev")
    print(f"")
    print(f"2. Start backend server on port 9001:")
    print(f"   cd /Users/wafflelover404/Documents/wikiai/graphtalk")
    print(f"   python3 api.py")
    print(f"")
    print(f"3. Test CMS login in browser:")
    print(f"   Navigate to http://localhost:3000")
    print(f"   Check browser console for '🔧 API Configuration:' log")
    print(f"   Try CMS login with admin credentials")
    print(f"")
    print(f"4. Verify requests go to port 9001:")
    print(f"   Open browser dev tools")
    print(f"   Check Network tab for CMS API requests")
    print(f"   Confirm URLs show localhost:9001")

if __name__ == "__main__":
    success = test_hardcoded_urls_removed()
    show_next_steps()
    
    if success:
        print(f"\n🎉 All hardcoded URLs removed! Ready for testing.")
    else:
        print(f"\n❌ Some hardcoded URLs remain. Please fix them first.")
