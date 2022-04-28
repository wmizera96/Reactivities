namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T? Value { get; set; }
        public string? Error { get; set; }


        private Result(bool isSuccess, T value)
        {
            this.IsSuccess = isSuccess;
            this.Value = value;
        }

        private Result(bool isSuccess, string error)
        {
            this.IsSuccess = isSuccess;
            this.Error = error;
        }

        public static Result<T> Success(T value) => new Result<T>(true, value);
        public static Result<T> Failure(string error) => new Result<T>(false, error);
    }
}