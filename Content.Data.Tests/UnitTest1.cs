using System;
using System.Linq;
using Content.Data.Models;
using Xunit;
using Xunit.Abstractions;

namespace Content.Data.Tests
{
    public class UnitTest1
    {
        private readonly ITestOutputHelper _output;

        public UnitTest1(ITestOutputHelper output)
        {
            _output = output;
        }

        [Fact]
        public void Test2() {
        }

        // [Fact]
        // public void Test1()
        // {
        //     using (var db = new DataContext())
        //     {
        //         var site = new Site
        //         {
        //             Name = "Desmond's Site",
        //             Posts = new[] {
        //                 new Post()
        //                 {
        //                     Title = "Post 1",
        //                     Slices = new[] {
        //                         new Slice() {
        //                             Type = "PARAGRAPH"
        //                         }
        //                     }
        //                 }
        //             }
        //         };
        //         db.SaveChanges();
        //         _output.WriteLine("DONE!");
        //     }
        // }
    }
}
