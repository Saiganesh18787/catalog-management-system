import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 max-w-xl mx-auto mt-10 bg-red-50 border border-red-200 rounded-xl text-red-900">
                    <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
                    <p className="mb-4">Please refresh the page. If the problem persists, check the console for more details.</p>
                    <details className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded border border-red-100">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
